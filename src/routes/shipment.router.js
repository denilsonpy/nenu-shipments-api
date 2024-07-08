import { Router } from "express";
import ShipmentController from "../controllers/shipment.controller.js";

const shipmentRouter = Router();

shipmentRouter.get("/search/:id", ShipmentController.getById);
shipmentRouter.get("/find", ShipmentController.find);
shipmentRouter.get("/carriers", ShipmentController.getCarriers);
shipmentRouter.post("/", ShipmentController.create);

export default shipmentRouter;
