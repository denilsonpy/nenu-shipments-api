import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.authenticate);
router.post("/refresh", AuthController.refresh);

export default router;
