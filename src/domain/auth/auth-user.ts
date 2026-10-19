export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

export interface PublicUser extends Omit<AuthUser, "passwordHash"> {}

export interface AuthUserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  create(input: { name: string; email: string; passwordHash: string }): Promise<AuthUser>;
}
