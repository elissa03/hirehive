import { createCv, getCv } from "../services/CV.service.js";

const createCvController = async (req, res) => {
    try {
        const result = await createCv(req.body);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCvController = async (req, res) => {
    try {
        const result = await getCv(req.params.cvId, req.body);

        if (result.status === 200) 
            return res.status(200).json(result.cv);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export { 
    createCvController,
    getCvController,
};