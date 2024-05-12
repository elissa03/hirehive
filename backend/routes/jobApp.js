import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import {
  createJobAppController,
  deleteJobAppController,
  shortlistJobAppController,
  getJobAppDetailsController,
  getApplicantsController,
  getMatchingJobAppsController,
  getMyJobAppsController,
} from "../controllers/jobApp.controller.js";

router.post("/apply/:jobId", authenticateToken, createJobAppController);
router.delete("/:jobAppId", authenticateToken, deleteJobAppController);
router.put("/:jobAppId", authenticateToken, shortlistJobAppController); 
router.get("/:jobAppId", authenticateToken, getJobAppDetailsController); 
router.get("/getAllApplicants/:jobId", authenticateToken, getApplicantsController);
router.get("/getMatchingApplicants/:jobId", authenticateToken, getMatchingJobAppsController);
router.get("/myJobApps/:userId", authenticateToken, getMyJobAppsController);

export { router as JobAppRouter };