import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createJobController, getJobDetailsController, getMyJobsController, 
         deleteJobController, updateJobController, getAllJobsController } from "../controllers/job.controller.js";

router.post("/", authenticateToken, createJobController);
router.get("/details/:jobId", authenticateToken, getJobDetailsController);
router.get("/myJobs/:userId", authenticateToken, getMyJobsController);
router.delete("/:jobId",authenticateToken, deleteJobController);
router.put("/:jobId", authenticateToken, updateJobController);
router.get("/", authenticateToken, getAllJobsController);

export { router as JobRouter };