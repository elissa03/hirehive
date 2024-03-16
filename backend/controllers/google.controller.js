import {googleSignUp} from "../services/google.service.js"

const googleSignUpController = async (req, res) =>{
    try {
        const result = googleSignUp({token: req.body})
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {googleSignUpController};