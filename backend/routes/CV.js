import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createCvController, getCvController } from "../controllers/CV.controller.js";

router.post("/", authenticateToken, createCvController);
router.get("/:cvId", authenticateToken, getCvController);

export { router as CvRouter };
