import express from "express";
const router = express.Router();
import { createCvController, getCvController } from "../controllers/CV.controller.js";

router.post("/cvs", createCvController);
router.get("/cvs/:cvId", getCvController);

export { router as CvRouter };
