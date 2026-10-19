import { AppError } from "../../domain/errors/app-error";
import type { CourseRepository, CourseWriteInput } from "../../domain/courses/course";

export class ManageCourses {
  constructor(private readonly courses: CourseRepository) {}

  create(input: CourseWriteInput) {
    return this.courses.create(input);
  }

  update(id: number, input: CourseWriteInput) {
    return this.courses.update(id, input);
  }

  async delete(id: number) {
    const existing = await this.courses.findById(id);
    if (!existing) throw new AppError("El curso solicitado no existe.", 404);
    await this.courses.delete(id);
  }
}
