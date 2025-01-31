import { Router } from "express";
import PackageController from "../controllers/package.controller.js";

const packageRouter = Router();

packageRouter.get("/shipped", PackageController.getShipped);

export default packageRouter;
