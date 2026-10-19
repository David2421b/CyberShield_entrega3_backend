import { z } from "zod";
import { ListCourses } from "../../application/courses/list-courses";
import { GetCourse } from "../../application/courses/get-course";
import { PrismaCourseRepository } from "../../infrastructure/courses/prisma-course-repository";
import type { RequestHandler } from "express";

const repository = new PrismaCourseRepository();
const listCourses = new ListCourses(repository);
const getCourse = new GetCourse(repository);

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  category: z.enum(["Red Team", "Blue Team", "DFIR"]).optional(),
});
const idSchema = z.coerce.number().int().positive();

export const listCoursesController: RequestHandler = async (req, res) => {
  const query = querySchema.parse(req.query);
  const result = await listCourses.execute(query);
  const totalPages = Math.ceil(result.total / query.limit);
  res.json({
    pagination: { page: query.page, limit: query.limit, totalItems: result.total, totalPages },
    data: result.data,
  });
};

export const getCourseController: RequestHandler = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const course = await getCourse.execute(id);
  res.json({ data: course });
};
