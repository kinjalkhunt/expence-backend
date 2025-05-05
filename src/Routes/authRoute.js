import { Router } from "express";
import { LoginUser, registerUser } from "../Controller/AuthController.js";
import { logoutUser } from "../Controller/logOutController.js";

export const authRoute = Router();
authRoute.post("/register", registerUser)
authRoute.post("/login", LoginUser)
authRoute.post("/user", logoutUser)