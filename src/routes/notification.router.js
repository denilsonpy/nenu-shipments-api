import { Router } from "express";
import NotificationController from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.post("/", NotificationController.notify);

export default notificationRouter;
