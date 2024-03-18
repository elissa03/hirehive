import { JobApp } from "../models/Job.js";
import { Job } from "../models/Job.js";
import { CV } from "../models/CV.js";
import { User } from "../models/User.js";

function getCurrentDate() {

    // Results in "YYYY-MM-DD"
    const dateString = now.toISOString().split('T')[0]; 
    const dateToStore = new Date(dateString);

    return dateToStore;
}

/**
 * 
 * This request expects the following data upon creating a job offer:
 * 'userId': to add new Job to user model & postedBy in Job,
 * 'firstName', 'lastName', 'coverLetter' (optional), 'cvId': requirements to apply for a job 
 * 
 * @param {*} data: req body 
 * @returns : status and message of creation
 */
const createJobApp = async (jobId, data) => {

    try { 

        const job = await Job.findById(jobId); 

        if (!job) {
            return { status: 404, message: 'Requested job does not exist!' }; 
        }

        if (!data.userId) {
            return { status: 400, message: `The userId is required.` };
        }

        const userId = data.userId;

        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }

        delete data.userId;

        let requiredFields = [ 'firstName', 'lastName', 'cvId' ];

        let missingField = requiredFields.find(field => (!data[field] || data[field].length === 0));

        if (missingField) {
            
            return { status: 400, message: `The ${missingField} field is required.` };

        }   

        const cvId = data.cvId;
        const cv = await CV.findById(cvId);

        if (!cv) {
            return { status: 404, message: 'CV does not exist!' }; 
        }

        if (job.isCoverLetterNeeded && (!data['coverLetter'] || data['coverLetter'].length === 0) ) {
            return { status: 400, message: `The cover letter field is required.` }
        }         

        data['userId'] = userId;
        data['jobId'] = jobId; 
        data['submissionDate'] = getCurrentDate();
        
        const newApplication =  new JobApp({...data});

        await newApplication.save();
 
        await User.findByIdAndUpdate(userId, { $push: { jobApps: newApplication._id } });
        await CV.findByIdAndUpdate(cvId, { $push: { jobApps: newApplication._id }});

        return { status: 200, message: "Application successful!" };

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};






export { 
    createJobApp,  
};