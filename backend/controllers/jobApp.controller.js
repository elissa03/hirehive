import { createJobApp } from "../services/jobApp.service.js";
 
const createJobAppController = async (req, res) => {
    try {
        const result = await createJobApp(req.params.jobId, req.body);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export { 
    createJobAppController,  
};