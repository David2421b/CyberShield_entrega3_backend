import { Router } from "express";
import { createCourseController, deleteCourseController, getCourseController, listCoursesController, updateCourseController } from "./course-controller";
import { asyncHandler } from "../http/async-handler";
import { authenticate } from "../http/authenticate";
import { requireAdmin } from "../http/require-role";

export const courseRouter = Router();

courseRouter.get("/", asyncHandler(listCoursesController));
courseRouter.get("/:id", asyncHandler(getCourseController));
courseRouter.post("/", authenticate, requireAdmin, asyncHandler(createCourseController));
courseRouter.put("/:id", authenticate, requireAdmin, asyncHandler(updateCourseController));
courseRouter.delete("/:id", authenticate, requireAdmin, asyncHandler(deleteCourseController));
