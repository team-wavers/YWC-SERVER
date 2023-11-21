import { Router } from "express";
import AuthController from "./auth.controller";

export const path = "/auth";
export const router = Router();

router.post("/signin", new AuthController().adminLogin);
