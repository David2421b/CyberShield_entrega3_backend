import { AppError } from "../../domain/errors/app-error";
import type { CourseRepository } from "../../domain/courses/course";

export class GetCourse {
  constructor(private readonly courses: CourseRepository) {}

  async execute(id: number) {
    const course = await this.courses.findById(id);
    if (!course) throw new AppError("El curso solicitado no existe.", 404);
    return course;
  }
}
