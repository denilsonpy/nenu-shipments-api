import { Router } from "express";
import AppointmentController from "../controllers/appointment.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const appointmentRouter = Router();

appointmentRouter.get(
  "/",
  permission(["read", "write", "admin"]),
  AppointmentController.getAll
);
appointmentRouter.post(
  "/",
  permission(["write", "admin"]),
  AppointmentController.create
);
appointmentRouter.delete(
  "/:id",
  permission(["write", "admin"]),
  AppointmentController.delete
);

export default appointmentRouter;
