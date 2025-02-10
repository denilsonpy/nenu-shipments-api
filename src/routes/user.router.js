import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const userRouter = Router();

userRouter.post("/", permission(["admin"]), UserController.create);
userRouter.get("/", permission(["admin"]), UserController.getAll);
userRouter.delete("/:id", permission(["admin"]), UserController.deleteById);

export default userRouter;
