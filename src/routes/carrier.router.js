import { Router } from "express";
import CarrierController from "../controllers/carrier.controller.js";

const carrierRouter = Router();

carrierRouter.post("/", CarrierController.create);

export default carrierRouter;
