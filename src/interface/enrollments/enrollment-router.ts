import { Router } from "express";
import { authenticate } from "../http/authenticate";
import { requireAdmin } from "../http/require-role";
import { asyncHandler } from "../http/async-handler";
import { createEnrollmentController, listAllEnrollmentsController, listMyEnrollmentsController } from "./enrollment-controller";

export const enrollmentRouter = Router();

enrollmentRouter.use(authenticate);
enrollmentRouter.post("/", asyncHandler(createEnrollmentController));
enrollmentRouter.get("/mias", asyncHandler(listMyEnrollmentsController));
enrollmentRouter.get("/", requireAdmin, asyncHandler(listAllEnrollmentsController));
