import type { Course } from "../courses/course";

export interface Enrollment {
  id: string;
  message: string | null;
  status: string;
  createdAt: Date;
  course: Course;
  user?: { id: string; name: string; email: string };
}

export interface EnrollmentRepository {
  create(input: { userId: string; courseId: number; message?: string }): Promise<Enrollment>;
  findManyForUser(userId: string): Promise<Enrollment[]>;
  findMany(): Promise<Enrollment[]>;
}
