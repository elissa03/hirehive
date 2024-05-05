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
    // convert applicant skills to lowercase for case-insensitive comparison
    const normalizedApplicantSkills = applicantSkills.map(skill => skill.toLowerCase());
    
    const totalSkills = jobSkills.length;

    // cf no skills required, automatically 100% match
    if (totalSkills === 0)
        return 100;

    let matchingSkills = 0;

    for (const skill of jobSkills) {
        // convert each job skill to lowercase before comparison
        if (normalizedApplicantSkills.includes(skill.toLowerCase())) {
            matchingSkills++;
        }
    }

    console.log('matching ', matchingSkills);
    return (matchingSkills / totalSkills) * 100;
}

async function findTopMatchingApplicants(job, applicants, threshold=10) {

    const matchingApplicants = []; 

    for (const applicant of applicants) {

        const cv = await CV.findById(applicant.cvId); 

        const matchingPercentage = Math.round(calculateMatchingPercentage(job.requirements, cv.skills));
        
        if (matchingPercentage >= threshold) {

            var applicantEntry = { [applicant.userId]: applicant, 'matchingPercentage': matchingPercentage };

            matchingApplicants.push(applicantEntry);
        }

    }

    return matchingApplicants.sort((a, b) => b.matchingPercentage - a.matchingPercentage);
}


async function getAppsForJob(jobId, userId) {

    if (!userId) {
        return { status: 400, message: 'The field userId is missing from req body' }; 
    }
    
    const user = await User.findById(userId); 

    if (!user) {
        return { status: 404, message: 'Requested user does not exist!' }; 
    }

    const job = await Job.findById(jobId);

    if (!job) {
        return { status: 404, message: 'Requested job does not exist!' }; 
    }
    
    if (userId !== job.postedBy.toString()) {
        return { status: 403, message: 'Forbidden: Only hirer can request Job Apps!' }; 
    }

    const jobApps = await JobApp.find({ jobId: jobId})

    return { status: 200, jobApps};
}


/**
 * Mediator function to ensure our date is valid
 * @param {*} date: string  "YYYY-MM-DD"
 * @returns true or false
 */
function isValidDate(date) {

    const deadlineDate = new Date(date);
    if (isNaN(deadlineDate.getTime())) { 
        return false;
    }

    return true;
}

export {
    getCurrentDate,
    isHirer,
    findTopMatchingApplicants,
    getAppsForJob,
    isValidDate
}