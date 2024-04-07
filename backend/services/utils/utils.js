import { JobApp } from "../../models/JobApp.js";
import { Job } from "../../models/Job.js";
import { CV } from "../../models/CV.js";
import { User } from "../../models/User.js";

function getCurrentDate() {

    const now = new Date();

    // Results in "YYYY-MM-DD"
    const dateString = now.toISOString().split('T')[0]; 
    const dateToStore = new Date(dateString);

    return dateToStore;
}

async function isHirer(jobId, userId) {
    const job = await Job.findById(jobId);
    const hirer = job.postedBy.toString(); 

    console.log('hirer ', hirer)
    console.log('user ', userId);

    if (userId === hirer)  
        return true;
    

    return false;
}

function calculateMatchingPercentage(jobSkills, applicantSkills) {
    const totalSkills = jobSkills.length;
    let matchingSkills = 0;

    for (const skill of jobSkills) {
        if (applicantSkills.includes(skill)) {
            matchingSkills++;
        }
    }

    return (matchingSkills / totalSkills) * 100;
}

function findTopMatchingApplicants(job, applicants, threshold=10) {

    const matchingApplicants = []; 

    for (const applicant of applicants) {

        const cv = CV.findById(applicant.cvId);

        const matchingPercentage = calculateMatchingPercentage(job.requirements, cv.skills);
        
        if (matchingPercentage >= threshold) {

            var applicantEntry = { [applicant.userId]: applicant, 'matchingPercentage': matchingPercentage };

            matchingApplicants.push(applicantEntry);
        }

    }

    return matchingApplicants.sort((a, b) => b.matchingPercentage - a.matchingPercentage);
}

async function getAppsForJob(jobId, data) {

    if (!data.userId) {
        return { status: 400, message: 'The field userId is missing from req body' }; 
    }

    const userId = data.userId;
    const user = await User.findById(userId); 

    if (!user) {
        return { status: 404, message: 'Requested user does not exist!' }; 
    }

    const job = await Job.findById(jobId);

    if (!job) {
        return { status: 404, message: 'Requested job does not exist!' }; 
    }

    if (!jobId in user.jobs) {
        return { status: 403, message: 'Forbidden: Only hirer can request Job Apps!' }; 
    }

    const jobApps = await JobApp.find({ jobId: jobId})

    return { status: 200, jobApps};
}

export {
    getCurrentDate,
    isHirer,
    findTopMatchingApplicants,
    getAppsForJob
}