import { CourseCategory as PrismaCourseCategory } from "@prisma/client";
import type { Enrollment, EnrollmentRepository } from "../../domain/enrollments/enrollment";
import { prisma } from "../database/prisma";

const categoryLabels: Record<PrismaCourseCategory, "Red Team" | "Blue Team" | "DFIR"> = {
  [PrismaCourseCategory.RED_TEAM]: "Red Team",
  [PrismaCourseCategory.BLUE_TEAM]: "Blue Team",
  [PrismaCourseCategory.DFIR]: "DFIR",
};

const courseSelection = {
  id: true,
  title: true,
  slug: true,
  category: true,
  level: true,
  duration: true,
  price: true,
  image: true,
  description: true,
};

function mapEnrollment(row: {
  id: string;
  message: string | null;
  status: string;
  createdAt: Date;
  course: { id: number; title: string; slug: string; category: PrismaCourseCategory; level: string; duration: string; price: { toNumber(): number }; image: string; description: string };
  user?: { id: string; name: string; email: string };
}): Enrollment {
  return {
    id: row.id,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt,
    ...(row.user ? { user: row.user } : {}),
    course: { ...row.course, category: categoryLabels[row.course.category], price: row.course.price.toNumber() },
  };
}

export class PrismaEnrollmentRepository implements EnrollmentRepository {
  async create(input: { userId: string; courseId: number; message?: string }) {
    const row = await prisma.enrollment.create({
      data: { userId: input.userId, courseId: input.courseId, message: input.message },
      include: { course: { select: courseSelection } },
    });
    return mapEnrollment(row);
  }

  async findManyForUser(userId: string) {
    const rows = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { course: { select: courseSelection } },
    });
    return rows.map(mapEnrollment);
  }

  async findMany() {
    const rows = await prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: courseSelection },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return rows.map(mapEnrollment);
  }
}
