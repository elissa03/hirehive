import { JobApp } from "../models/JobApp.js";
import { Job } from "../models/Job.js";
import { CV } from "../models/CV.js";
import { User } from "../models/User.js";
import { getCurrentDate, isHirer, findTopMatchingApplicants, getAppsForJob } from "./utils/utils.js";

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

        console.log(data)
        const job = await Job.findById(jobId); 

        if (!job) {
            return { status: 404, message: 'Requested job does not exist!' }; 
        }

        if (!('userId' in data) || !data.userId) {
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


/**
 * The request expects userId in req.body, and jobAppId as param, makes sure the requested jobApp is existent,
 * the user exists, and whether he/she has permission to delete this jobApp (only the applicants can revoke 
 * their applications)
 * @param {*} jobAppId : from req.params
 * @param {*} data : req.body
 * @returns 
 */
const deleteJobApp = async (jobAppId, data) => {

    try {  
        
        if (!data.userId) {
            return { status: 400, message: 'The field userId is missing from req body' }; 
        }

        const jobApp =  await JobApp.findById(jobAppId); 
        
        if (!jobApp) {
            return { status: 404, message: 'Job App not found!' }; 
        }
            
        const user = await User.findById(data.userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }

        if (data.userId !== jobApp.userId.toString()) {
            return { status: 403, message: 'Forbidden: Job App does not correspond to user!' }; 
        }        
        
        await JobApp.deleteOne({ _id: jobAppId });

        await User.updateOne(
            { _id: user._id }, 
            { $pull: { jobApps: jobAppId } } 
        );

        await CV.updateOne(
            { _id: jobApp.cvId }, 
            { $pull: { jobApps: jobAppId } } 
        );
        
        return { status: 200, message: "Job App deleted successfully."};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};


/**
 * The request expects userId in req.body, and jobId as param, makes sure the requested 
 * job is existent, the user exists, and whether he/she has permission to shortlist 
 * this application.
 * @param {*} jobAppId : from req.params
 * @param {*} data : req.body: {userID: ...}
 * @returns 
 */
const shortlistJobApp = async (jobAppId, data) => {

    try {  
        
        if (!data.userId) {
            return { status: 400, message: 'The field userId is missing from req body' }; 
        }

        const jobApp =  await JobApp.findById(jobAppId);
        
        if (!jobApp) {
            return { status: 404, message: 'Job App not found!' }; 
        }
            
        const user = await User.findById(data.userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }
        
        if (!(await isHirer(jobApp.jobId, data.userId))) {
            return { status: 403, message: 'Forbidden: Only hirer can update job App!' }; 
        }        
        
        await JobApp.findByIdAndUpdate(jobAppId, {'isShortListed': true }, { new: true });         

        return { status: 200, message: "JobApp shortlisted successfully."};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

/**
 * The request expects userId in req.body, and jobAppId, makes sure the requested job is existent,
 * the user exists
 * @param {*} jobAppId : from req.params
 * @param {*} data : req.body
 * @returns 
 */
const getJobAppDetails = async (jobAppId, data) => {

    try {  
        
        if (!data.userId) {
            return { status: 400, message: 'The field userId is missing from req body' }; 
        }

        const jobApp =  await JobApp.findById(jobAppId);
        
        if (!jobApp) {
            return { status: 404, message: 'Job App not found!' }; 
        }
         
        const user = await User.findById(data.userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }
          
        if (!(await isHirer(jobApp.jobId, data.userId))) {
            console.log('here')
            return { status: 403, message: 'Forbidden: Only hirer can view Job App!' }; 
        }   

        await JobApp.findByIdAndUpdate(jobAppId, {"status": "Under Review"})

        console.log('success ' + JSON.stringify(jobApp));
        
        return { status: 200, jobApp};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

/**
 * The request expects userId in req.body, makes sure the user is existent, 
 * and gets the jobs excluding the ones created by the person
 * @param
 * @param {*} data : req.body 
 * @returns {jobAppId1: jobAppData1, ...}
 */
const getJobApps = async(jobId, data) => {
    try {  
         
        const result = getAppsForJob(jobId, data);

        if (result.status === 200) {

            const jobApps = result.jobApps;

            const transformedJobApps = jobApps.reduce((acc, jobApp) => {

                // convert Mongoose document to a plain JavaScript object
                const jobAppObj = jobApp.toObject();
                
                // extract _id and rest of the properties
                const { _id, ...rest } = jobAppObj;
            
                // use _id as key, rest of the data as value
                acc[_id.toString()] = rest;
            
                return acc;

            }, {});
     
            return { status: 200, jobApps: transformedJobApps };
        }

        return result;        

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
}

/**
 * The request expects userId in req.body, makes sure the user is existent, 
 * and gets the jobs created by the person
 * 
 * @param {*} userId : Id of user from params 
 * @returns {status: status, jobApps: [{jobId1: jobData1, matchingPercentage: matching}, ]}
 */
const getMatchingJobApps = async(jobId, data) => {
    try {  
           
        const result = await getAppsForJob(jobId, data);
    
        if (result.status === 200) { 

            const job = await Job.findById(jobId);

            const matching = findTopMatchingApplicants(job, result.jobApps, threshold=10);

            return {status: 200, jobApps: matching};
        }

        return result;

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
}



export { 
    createJobApp,  
    deleteJobApp,
    shortlistJobApp,
    getJobAppDetails,
    getJobApps,
    getMatchingJobApps
};