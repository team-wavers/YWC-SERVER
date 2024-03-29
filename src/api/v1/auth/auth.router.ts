import { Router } from "express";
import AuthController from "./auth.controller";
import verifyCookie from "../../../lib/verify-cookie";

export const path = "/auth";
export const router = Router();

router.post("/signin", new AuthController().adminSignIn);
router.post("/signout", verifyCookie, new AuthController().adminSignOut);
