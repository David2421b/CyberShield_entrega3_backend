import { Router } from "express";
import { getCourseController, listCoursesController } from "./course-controller";
import { asyncHandler } from "../http/async-handler";

export const courseRouter = Router();

courseRouter.get("/", asyncHandler(listCoursesController));
courseRouter.get("/:id", asyncHandler(getCourseController));
