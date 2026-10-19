import { z } from "zod";
import type { RequestHandler } from "express";
import { RegisterUser } from "../../application/auth/register-user";
import { LoginUser } from "../../application/auth/login-user";
import { PrismaAuthUserRepository } from "../../infrastructure/auth/prisma-auth-user-repository";

const users = new PrismaAuthUserRepository();
const registerUser = new RegisterUser(users);
const loginUser = new LoginUser(users);

const registerSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

export const registerController: RequestHandler = async (req, res) => {
  const input = registerSchema.parse(req.body);
  const user = await registerUser.execute(input);
  res.status(201).json({ data: user });
};

export const loginController: RequestHandler = async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await loginUser.execute(input.email, input.password);
  res.json({ data: result });
};
