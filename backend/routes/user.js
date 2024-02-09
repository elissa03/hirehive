import express from "express";
const router = express.Router();
import { createUserController } from "../controllers/user.controller.js";

router.post("/signup", createUserController);

export { router as UserRouter };
