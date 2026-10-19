import { z } from "zod";
import { ListCourses } from "../../application/courses/list-courses";
import { GetCourse } from "../../application/courses/get-course";
import { ManageCourses } from "../../application/courses/manage-courses";
import { PrismaCourseRepository } from "../../infrastructure/courses/prisma-course-repository";
import type { RequestHandler } from "express";

const repository = new PrismaCourseRepository();
const listCourses = new ListCourses(repository);
const getCourse = new GetCourse(repository);
const manageCourses = new ManageCourses(repository);

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  category: z.enum(["Red Team", "Blue Team", "DFIR"]).optional(),
});
const idSchema = z.coerce.number().int().positive();
const courseSchema = z.object({
  title: z.string().trim().min(3).max(180),
  category: z.enum(["Red Team", "Blue Team", "DFIR"]),
  level: z.string().trim().min(2).max(40),
  duration: z.string().trim().min(2).max(40),
  price: z.coerce.number().finite().positive().max(99999999.99),
  image: z.string().trim().url().max(2000),
  description: z.string().trim().min(10).max(5000),
});

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

export const createCourseController: RequestHandler = async (req, res) => {
  const input = courseSchema.parse(req.body);
  const course = await manageCourses.create(input);
  res.status(201).json({ data: course });
};

export const updateCourseController: RequestHandler = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  const input = courseSchema.parse(req.body);
  const course = await manageCourses.update(id, input);
  res.json({ data: course });
};

export const deleteCourseController: RequestHandler = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  await manageCourses.delete(id);
  res.status(204).send();
};
