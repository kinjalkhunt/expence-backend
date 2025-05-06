import { Router } from "express";
import { addOutExpense, GetPayment } from "../Controller/OutPayment.js";
import { upload } from "../Middleware/multer.js";

export const outPayRoute = Router();
outPayRoute.post("/expence", upload.single("receiptUrl"), addOutExpense)
outPayRoute.get("/getOut", GetPayment)