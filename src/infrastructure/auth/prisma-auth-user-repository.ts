import type { AuthUser, AuthUserRepository } from "../../domain/auth/auth-user";
import { prisma } from "../database/prisma";

export class PrismaAuthUserRepository implements AuthUserRepository {
  findByEmail(email: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  create(input: { name: string; email: string; passwordHash: string }): Promise<AuthUser> {
    return prisma.user.create({ data: input });
  }
}
