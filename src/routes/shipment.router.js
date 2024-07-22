import { Router } from "express";
import ShipmentController from "../controllers/shipment.controller.js";

const shipmentRouter = Router();

shipmentRouter.get("/search/:id", ShipmentController.getById);
shipmentRouter.get("/", ShipmentController.getAll);
shipmentRouter.post("/", ShipmentController.create);

export default shipmentRouter;
