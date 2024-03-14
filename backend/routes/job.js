import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createJobController, getJobDetailsController, getMyJobsController, 
         deleteJobController, updateJobController } from "../controllers/job.controller.js";

router.post("/", createJobController);
router.get("/details/:jobId",  getJobDetailsController);
router.get("/myJobs/:userId",  getMyJobsController);
router.delete("/:jobId", deleteJobController);
router.put("/:jobId",  updateJobController);
// router.get("/", getAllJobsController);

export { router as JobRouter };