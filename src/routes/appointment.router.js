import { Router } from "express";
import AppointmentController from "../controllers/appointment.controller.js";

const appointmentRouter = Router();

appointmentRouter.get("/", AppointmentController.getAll);
appointmentRouter.post("/", AppointmentController.create);

export default appointmentRouter;
