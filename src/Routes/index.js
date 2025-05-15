import { Router } from "express";
import { authRoute } from "./authRoute.js";
import { addPayRoute } from "./addPayRoute.js";
import path from "path";
import { outPayRoute } from "./outPayRoute.js";
import express from "express";

export const routes = Router();

// Auth routes
routes.use("/auth", authRoute);
routes.use("/auth/login", authRoute);
routes.use("/auth/logout", authRoute);

// Static file serving
routes.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Payment routes
routes.use("/addPay", addPayRoute);
routes.use("/addOut", outPayRoute);