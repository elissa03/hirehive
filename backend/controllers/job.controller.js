import { createJob, getJobDetails, getMyJobs, deleteJob, updateJob, getAllJobs } from "../services/job.service.js";

const createJobController = async (req, res) => {
    try {
        const result = await createJob(req.body);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getJobDetailsController = async (req, res) => {
    try {
        const result = await getJobDetails(req.params.jobId, req.body);

        if (result.status === 200) 
            return res.status(200).json(result.job);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMyJobsController = async (req, res) => {
    try {
        const result = await getMyJobs(req.params.userId);

        if (result.status === 200) 
            return res.status(200).json(result.jobs);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteJobController = async(req, res) => {
    try {
        const result = await deleteJob(req.params.jobId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateJobController = async(req, res) => {
    try {
        const result = await updateJob(req.params.jobId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAllJobsController = async (req, res) => {
    try {
        const result = await getAllJobs(req.body);

        if (result.status === 200) 
            return res.status(200).json(result.jobs);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export { 
    createJobController, 
    getJobDetailsController,
    getMyJobsController,
    deleteJobController,
    updateJobController,
    getAllJobsController
};