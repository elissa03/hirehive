import express from "express";
const router = express.Router();
import { uploadFile, getFile } from "../controllers/firebase.controller.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("filename"), uploadFile);
router.get("/:type/:filename", getFile);

export { router as FirebaseRouter };
