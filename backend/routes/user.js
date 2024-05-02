import express from "express";
const router = express.Router();
import { createUserController, getUserByIdController} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/jwt.js";

router.post("/signup", createUserController);
router.get("/:userId", authenticateToken, getUserByIdController);

export { router as UserRouter };
