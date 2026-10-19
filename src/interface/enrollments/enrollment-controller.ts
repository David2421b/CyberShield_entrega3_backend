import { z } from "zod";
import type { RequestHandler } from "express";
import { ManageEnrollments } from "../../application/enrollments/manage-enrollments";
import { PrismaCourseRepository } from "../../infrastructure/courses/prisma-course-repository";
import { PrismaEnrollmentRepository } from "../../infrastructure/enrollments/prisma-enrollment-repository";
import { AppError } from "../../domain/errors/app-error";

const manageEnrollments = new ManageEnrollments(new PrismaCourseRepository(), new PrismaEnrollmentRepository());
const enrollmentSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  message: z.string().trim().max(2000).optional(),
});

export const createEnrollmentController: RequestHandler = async (req, res) => {
  if (!req.authUser) throw new AppError("Se requiere autenticación.", 401);
  const input = enrollmentSchema.parse(req.body);
  const enrollment = await manageEnrollments.create({ ...input, userId: req.authUser.id });
  res.status(201).json({ data: enrollment });
};

export const listMyEnrollmentsController: RequestHandler = async (req, res) => {
  if (!req.authUser) throw new AppError("Se requiere autenticación.", 401);
  res.json({ data: await manageEnrollments.mine(req.authUser.id) });
};

export const listAllEnrollmentsController: RequestHandler = async (_req, res) => {
  res.json({ data: await manageEnrollments.all() });
};
