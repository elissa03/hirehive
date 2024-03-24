import { createJobApp, deleteJobApp, shortlistJobApp, getJobAppDetails } from "../services/jobApp.service.js";
 
const createJobAppController = async (req, res) => {
    try {
        const result = await createJobApp(req.params.jobId, req.body);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// controller to revoke an application in case the applying user wanted to delete the application
const deleteJobAppController = async(req, res) => {
    try {
        const result = await deleteJobApp(req.params.jobAppId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const shortlistJobAppController = async(req, res) => {
    try {
        const result = await shortlistJobApp(req.params.jobAppId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getJobAppDetailsController = async (req, res) => {
    try {
        const result = await getJobAppDetails(req.params.jobAppId, req.body);

        if (result.status === 200) 
            return res.status(200).json(result.jobApp);

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
    createJobAppController,  
    deleteJobAppController,
    shortlistJobAppController,
    getJobAppDetailsController
};