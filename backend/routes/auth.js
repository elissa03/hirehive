import express from "express";
const router = express.Router();
import { loginController, forgotPassController, resetPassController } from "../controllers/auth.controller.js";

router.post("/login", loginController);
router.post("/forgotpass", forgotPassController);
router.post("/resetpass/:token", resetPassController);

export {router as AuthRouter}