import { Router } from "express";
import { addPayment, getPayment } from "../Controller/AddPayment.js";
import { upload } from "../Middleware/multer.js";

export const addPayRoute = Router();
addPayRoute.post("/in",upload.single("receipt"), addPayment)
addPayRoute.get("/getIn", getPayment)