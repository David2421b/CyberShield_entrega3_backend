import type { CourseFilters, CourseRepository } from "../../domain/courses/course";

export class ListCourses {
  constructor(private readonly courses: CourseRepository) {}

  execute(filters: CourseFilters) {
    return this.courses.findMany(filters);
  }
}
