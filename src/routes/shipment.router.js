import { Router } from "express";
import ShipmentController from "../controllers/shipment.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const shipmentRouter = Router();

shipmentRouter.get(
  "/search/:id",
  permission(["read", "write", "admin"]),
  ShipmentController.getById
);
shipmentRouter.get(
  "/",
  permission(["read", "write", "admin"]),
  ShipmentController.getAll
);
shipmentRouter.post(
  "/",
  permission(["write", "admin"]),
  ShipmentController.create
);

export default shipmentRouter;
