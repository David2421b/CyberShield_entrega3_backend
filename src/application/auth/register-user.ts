import { hash } from "bcryptjs";
import { AppError } from "../../domain/errors/app-error";
import type { AuthUserRepository, PublicUser } from "../../domain/auth/auth-user";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(private readonly users: AuthUserRepository) {}

  async execute(input: RegisterInput): Promise<PublicUser> {
    const email = input.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new AppError("Ya existe una cuenta con ese correo electrónico.", 409);
    }
    const passwordHash = await hash(input.password, 12);
    const user = await this.users.create({ name: input.name.trim(), email, passwordHash });
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
