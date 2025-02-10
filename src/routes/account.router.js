import { Router } from "express";
import AccountController from "../controllers/account.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const router = Router();

router.get("/", permission(["admin"]), AccountController.getAllAccounts);
router.post("/vinculate", permission(["admin"]), AccountController.vinculate);
router.delete("/:id", permission(["admin"]), AccountController.removeAccount);

export default router;
