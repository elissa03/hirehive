import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createJobAppController, deleteJobAppController,
         shortlistJobAppController, getJobAppDetailsController,
         getApplicantsController, getMatchingJobAppsController } from "../controllers/jobApp.controller.js";

router.post("/apply/:jobId", authenticateToken, createJobAppController);
router.delete("/:jobAppId", authenticateToken, deleteJobAppController);
router.put("/:jobAppId", authenticateToken, shortlistJobAppController); 
router.get("/:jobAppId", authenticateToken, getJobAppDetailsController); 
router.get("/getAllApplicants/:jobId", getApplicantsController);
router.get("/getMatchingApplicants/:jobId", getMatchingJobAppsController);

export { router as JobAppRouter };