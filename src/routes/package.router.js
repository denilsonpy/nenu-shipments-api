import { Router } from "express";
import PackageController from "../controllers/package.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const packageRouter = Router();

packageRouter.get(
  "/pending",
  permission(["read", "write", "admin"]),
  PackageController.getPending
);

export default packageRouter;
