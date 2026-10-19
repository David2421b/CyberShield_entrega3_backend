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
}
