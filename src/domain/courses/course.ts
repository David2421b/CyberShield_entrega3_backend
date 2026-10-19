export type CourseCategory = "Red Team" | "Blue Team" | "DFIR";

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: CourseCategory;
  level: string;
  duration: string;
  price: number;
  image: string;
  description: string;
}

export interface CourseFilters {
  page: number;
  limit: number;
  category?: CourseCategory;
}

export interface CourseRepository {
  findMany(filters: CourseFilters): Promise<{ data: Course[]; total: number }>;
  findById(id: number): Promise<Course | null>;
  create(input: CourseWriteInput): Promise<Course>;
  update(id: number, input: CourseWriteInput): Promise<Course>;
  delete(id: number): Promise<void>;
}

export type CourseWriteInput = Omit<Course, "id" | "slug">;
