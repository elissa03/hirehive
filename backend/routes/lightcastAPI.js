import express from "express";
import { lightcastAPIController } from "../controllers/lightcastAPI.controller.js";
const router = express.Router();  

router.post("/get-token", lightcastAPIController); 

export { router as lightcastAPIRouter };
