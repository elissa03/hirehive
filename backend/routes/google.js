import express from "express";
const router = express.Router();
import {googleSignUpController} from "../controllers/google.controller.js"

router.post("/signup", googleSignUpController);

export {router as GoogleRouter}