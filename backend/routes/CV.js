import express from "express";
const router = express.Router();
import {authenticateToken} from '../middlewares/jwt.js'
import { createCvController, getCvController, deleteCvController, 
         getAllCvsController, updateCvController } from "../controllers/CV.controller.js";

router.post("/", authenticateToken, createCvController);
router.get("/:cvId", authenticateToken,  getCvController);
router.delete("/:cvId", authenticateToken, deleteCvController);
router.get("/getAll/:userId", authenticateToken, getAllCvsController);
router.put("/:cvId", authenticateToken, updateCvController)
export { router as CvRouter };
