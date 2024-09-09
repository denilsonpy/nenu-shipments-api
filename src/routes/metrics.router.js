import { Router } from "express";
import MetricsController from "../controllers/metrics.controller.js";

const metricsRouter = Router();

metricsRouter.get("/resume", MetricsController.getResume);
metricsRouter.get(
  "/quantity_by_carrier",
  MetricsController.getQuantityByCarrier
);
metricsRouter.get("/recent", MetricsController.getLatestRecords);

export default metricsRouter;
