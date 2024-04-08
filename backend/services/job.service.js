import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { isValidDate } from "./utils/utils.js";

/**
 *
 * This request expects the following data upon creating a job offer:
 * 'userId': to add new Job to user model & postedBy in Job,
 * 'title', 'description', 'requirements': [], 'type': ('Part-time', 'Full-time', 'Internship', 'Project'),
 * 'deadline' (optional), 'isCoverLetterNeeded' (optional): Job details 
 * 
 * @param {*} data: req body 
 * @returns : status and message of creation
 */
const createJob = async (data) => { 
  try {
      console.log("data " + JSON.stringify(data));

      if (!data.userId) {
          return { status: 400, message: `The userId is required.` };
      }

      const userId = data.userId;
      delete data.userId;

      const requiredFields = ['title', 'description', 'requirements', 'type'];

      let missingField = requiredFields.find(field => (!data[field] || data[field].length === 0));

      if (missingField) {
          
          return { status: 400, message: `The ${missingField} field is required.` };

      }  

      if ('deadline' in data) {
          if (data['deadline']) { 
              if (!isValidDate(data['deadline'])) 
              return { status: 400, message: "The deadline is not a valid date." };
          }
          else {
              delete data['deadline'];
          }
      }
      
      data['postedBy'] = userId;

      const newJob =  new Job({...data});

      await newJob.save();

      await User.findByIdAndUpdate(userId, { $push: { jobs: newJob._id } });

      return { status: 201, message: "Job created!" };

  } catch (error) {

      console.log(error);
      return { status: 500, message: "Internal error" };

  }
     
};

/**
 * The request expects userId in req.body, and jobId, makes sure the requested job is existent,
 * the user exists
 * @param {*} jobId : from req.params
 * @param {*} data : req.body
 * @returns
 */
const getJobDetails = async (jobId, data) => {
  try {
    if (!data.userId) {
      return {
        status: 400,
        message: "The field userId is missing from req body",
      };
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return { status: 404, message: "Job not found!" };
    }

    const user = await User.findById(data.userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    console.log("success " + JSON.stringify(job));

    return { status: 200, job };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

/**
 * The request expects userId in req.body, makes sure the user is existent,
 * and gets the jobs created by the person
 *
 * @param {*} userId : Id of user from params
 * @returns {jobId1: jobData1, ...}
 */
const getMyJobs = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    const jobIds = user.jobs;
    let jobObjs = {};

    const jobPromises = jobIds.map((jobId) => Job.findById(jobId));

    const jobs = await Promise.all(jobPromises);

    jobs.forEach((job) => {
      jobObjs[job._id] = job;
    });

    return { status: 200, jobs: jobObjs };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

/**
 * The request expects userId in req.body, and jobId as param, makes sure the requested job is existent,
 * the user exists, and whether he/she has permission to delete this job
 * @param {*} jobId : from req.params
 * @param {*} data : req.body
 * @returns
 */
const deleteJob = async (jobId, data) => {
  try {
    if (!data.userId) {
      return {
        status: 400,
        message: "The field userId is missing from req body",
      };
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return { status: 404, message: "Job not found!" };
    }

    const user = await User.findById(data.userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    console.log(`userId ${data.userId}`);
    console.log(`postedBy ${job.postedBy}`);

    if (data.userId !== job.postedBy.toString()) {
      return {
        status: 403,
        message: "Forbidden: Job does not correspond to user!",
      };
    }

    await Job.deleteOne({ _id: jobId });

    await User.updateOne({ _id: user._id }, { $pull: { jobs: jobId } });

    return { status: 200, message: "Job deleted successfully." };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

/**
 * The request expects userId in req.body, and jobId as param, and newData as obj in req.body,
 * makes sure the requested job is existent, the user exists, and whether he/she has permission
 * to update this job.
 * @param {*} jobId : from req.params
 * @param {*} data : req.body: {userID: ..., newData: {}}
 * @returns
 */
const updateJob = async (jobId, data) => {

  try {  
      
      if (!data.userId) {
          return { status: 400, message: 'The field userId is missing from req body' }; 
      }

      const job =  await Job.findById(jobId);
      
      if (!job) {
          return { status: 404, message: 'Job not found!' }; 
      }
        
      const user = await User.findById(data.userId);

      if (!user) {
          return { status: 404, message: 'Requested user does not exist!' }; 
      }

      if (data.userId !== job.postedBy.toString()) {
          return { status: 403, message: 'Forbidden: Job does not correspond to user!' }; 
      }        

      if (!data['newData'] || typeof data['newData'] !== 'object' || Object.keys(data['newData']).length === 0) {
          return { status: 400, message: 'The new data is missing from req body or wrong format!' }; 
      }

      const newData = data.newData;

        if ('deadline' in newData) {
          if(newData.deadline) {
              if (!isValidDate(newData.deadline)) 
              return { status: 400, message: "The deadline is not a valid date." };
          }

          // if the deadline is empty delete it from data
          else {
              delete newData['deadline'];
          }
        }
      
      await Job.updateOne({ _id: jobId }, {$set: {
          ...newData
      }});          

      return { status: 200, message: "Job updated successfully."};

  } catch (error) {

      console.log(error);
      return { status: 500, message: "Internal error" };

  }

};

/**
 * The request expects userId in req.body, makes sure the user is existent,
 * and gets the jobs excluding the ones created by the person
 *
 * @param {*} data : req.body
 * @returns {jobId1: jobData1, ...}
 */
const getAllJobs = async (data) => {
  try {
    if (!data.userId) {
      return {
        status: 400,
        message: "The field userId is missing from req body",
      };
    }

    const userId = data.userId;
    const user = await User.findById(userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    const jobs = await Job.find({ postedBy: { $ne: userId } });

    return { status: 200, jobs };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export {
  createJob,
  getJobDetails,
  getMyJobs,
  deleteJob,
  updateJob,
  getAllJobs,
};
