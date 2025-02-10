import { Router } from "express";
import CarrierController from "../controllers/carrier.controller.js";
import { permission } from "../middlewares/permission.middleware.js";

const carrierRouter = Router();

carrierRouter.get(
  "/",
  permission(["read", "write", "admin"]),
  CarrierController.getAll
);
carrierRouter.post("/", permission(["admin"]), CarrierController.create);
carrierRouter.get("/:id", permission(["admin"]), CarrierController.getById);
carrierRouter.delete(
  "/:id",
  permission(["admin"]),
  CarrierController.deleteById
);
carrierRouter.put("/:id", permission(["admin"]), CarrierController.updateById);

export default carrierRouter;
