import { AppError } from "../../domain/errors/app-error";
import type { CourseRepository } from "../../domain/courses/course";
import type { EnrollmentRepository } from "../../domain/enrollments/enrollment";

export class ManageEnrollments {
  constructor(private readonly courses: CourseRepository, private readonly enrollments: EnrollmentRepository) {}

  async create(input: { userId: string; courseId: number; message?: string }) {
    if (!(await this.courses.findById(input.courseId))) {
      throw new AppError("El curso seleccionado no existe.", 404);
    }
    return this.enrollments.create(input);
  }

  mine(userId: string) {
    return this.enrollments.findManyForUser(userId);
  }

  all() {
    return this.enrollments.findMany();
  }
}
