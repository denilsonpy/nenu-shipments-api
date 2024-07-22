import { Router } from "express";
import CarrierController from "../controllers/carrier.controller.js";

const carrierRouter = Router();

carrierRouter.post("/", CarrierController.create);
carrierRouter.get("/", CarrierController.getAll);
carrierRouter.delete("/:id", CarrierController.deleteById);
carrierRouter.put("/:id", CarrierController.updateById);

export default carrierRouter;
