import { createCv, getCv, deleteCv, getAllCvs, updateCv } from "../services/CV.service.js";

const createCvController = async (req, res) => {
    try {
        const result = await createCv(req.body);
        if (result.status === 201)
            res.status(201).json({ message: result.message, cvId: result.cvId});
        else
            return res.status(result.status).json({message: result.message});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCvController = async (req, res) => {
    try {
        const result = await getCv(req.params.cvId, req.query.userId);

        if (result.status === 200) 
            return res.status(200).json(result.cv);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCvController = async(req, res) => {
    try {
        const result = await deleteCv(req.params.cvId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateCvController = async(req, res) => {
    try {
        const result = await updateCv(req.params.cvId, req.body);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAllCvsController = async (req, res) => {
    try {
        const result = await getAllCvs(req.params.userId);

        if (result.status === 200) 
            return res.status(200).json(result.cvs);

        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { 
    createCvController,
    getCvController,
    deleteCvController,
    getAllCvsController,
    updateCvController
};