import { compare } from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { AppError } from "../../domain/errors/app-error";
import type { AuthUserRepository, PublicUser } from "../../domain/auth/auth-user";

export interface LoginResult {
  token: string;
  user: PublicUser;
}

export class LoginUser {
  constructor(
    private readonly users: AuthUserRepository,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: SignOptions["expiresIn"],
  ) {}

  async execute(emailInput: string, password: string): Promise<LoginResult> {
    const user = await this.users.findByEmail(emailInput.trim().toLowerCase());
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new AppError("Correo electrónico o contraseña incorrectos.", 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return { token, user: publicUser };
  }
}
