import { Router } from "express";
import LabelController from "../controllers/label.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const labelRouter = Router();

labelRouter.get(
  "/:id",
  permission(["read", "write", "admin"]),
  LabelController.getById
);

export default labelRouter;
