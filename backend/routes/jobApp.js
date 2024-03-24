import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createJobAppController, deleteJobAppController,
         shortlistJobAppController, getJobAppDetailsController } from "../controllers/jobApp.controller.js";

router.post("/apply/:jobId", createJobAppController);
router.delete("/:jobAppId", deleteJobAppController);
router.put("/:jobAppId", shortlistJobAppController); 
router.get("/:jobAppId", getJobAppDetailsController); 
// router.get("/getAllApplicants/:jobId", getJobAppsController);
// router.get("/getMatchingApplicants/:jobId", getMatchingJobAppsController);

export { router as JobAppRouter };