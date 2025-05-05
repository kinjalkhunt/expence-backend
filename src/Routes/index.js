import { Router } from "express";
import { authRoute } from "./authRoute.js";
import { addPayRoute } from "./addPayRoute.js";
import path from "path";

export const routes = Router();
routes.use("/user", authRoute)
routes.use("/usrLogin", authRoute)
routes.use("/logout",authRoute)
// routes.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

routes.use("/addPay",addPayRoute)