import { CourseCategory as PrismaCourseCategory, Prisma } from "@prisma/client";
import type { Course, CourseCategory, CourseFilters, CourseRepository } from "../../domain/courses/course";
import { prisma } from "../database/prisma";

const toDomainCategory: Record<PrismaCourseCategory, CourseCategory> = {
  [PrismaCourseCategory.RED_TEAM]: "Red Team",
  [PrismaCourseCategory.BLUE_TEAM]: "Blue Team",
  [PrismaCourseCategory.DFIR]: "DFIR",
};

function toCourse(row: Prisma.CourseGetPayload<object>): Course {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: toDomainCategory[row.category],
    level: row.level,
    duration: row.duration,
    price: Number(row.price),
    image: row.image,
    description: row.description,
  };
}

export class PrismaCourseRepository implements CourseRepository {
  async findMany(filters: CourseFilters) {
    const where: Prisma.CourseWhereInput = filters.category
      ? { category: filters.category === "Red Team" ? PrismaCourseCategory.RED_TEAM : filters.category === "Blue Team" ? PrismaCourseCategory.BLUE_TEAM : PrismaCourseCategory.DFIR }
      : {};
    const [rows, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.course.count({ where }),
    ]);
    return { data: rows.map(toCourse), total };
  }

  async findById(id: number) {
    const row = await prisma.course.findUnique({ where: { id } });
    return row ? toCourse(row) : null;
  }
}
