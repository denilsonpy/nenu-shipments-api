import { Router } from "express";
import AccountController from "../controllers/account.controller.js";

const router = Router();

router.get("/", AccountController.getAllAccounts);
router.post("/vinculate", AccountController.vinculate);
router.delete("/:id", AccountController.removeAccount);

export default router;
