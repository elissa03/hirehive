import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createJobAppController } from "../controllers/jobApp.controller.js";

router.post("/apply/:jobId", createJobAppController);
// router.get("/:jobAppId", getJobAppDetailsController); 
// router.get("/getAllApplicants/:jobId", getJobAppsController);
// router.get("/getMatchingApplicants/:jobId", getMatchingJobAppsController);
// router.delete("/:jobAppId", deleteJobAppController);
// router.put("/:jobAppId", shortlistJobAppController); 

export { router as JobAppRouter };