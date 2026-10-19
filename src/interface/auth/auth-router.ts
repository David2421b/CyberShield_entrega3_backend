import { Router } from "express";
import { loginController, registerController } from "./auth-controller";
import { asyncHandler } from "../http/async-handler";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(registerController));
authRouter.post("/login", asyncHandler(loginController));
