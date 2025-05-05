

import { redis } from "../DBConnection/redisConnect.js";
import { InPay } from "../Schema/InPayment.js";
import moment from 'moment';  // Ensure this import is present

export const addPayment = async (req, res) => {
    try {
        const { amount, description, paymentMode, paymentDate } = req.body;
        const receiptFile = req.file;
        console.log("req.file ===>", req.file);


        if (!amount || !description || !paymentMode || !paymentDate) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Ensure paymentDate is formatted correctly
        const formattedPaymentDate = moment(paymentDate, 'YYYY-MM-DD', true).isValid()
            ? moment(paymentDate).toISOString()
            : new Date(paymentDate).toISOString();

        const receiptUrl = receiptFile ? `/uploads/receipts/${receiptFile.filename}` : undefined;
        console.log(">>>>>>>>", receiptUrl);

        const payment = await InPay.create({
            amount,
            description,
            paymentMode,
            paymentDate: formattedPaymentDate,
            receiptUrl,
        });

        await redis.set(`payment:${payment.id}`, JSON.stringify(payment), {
            EX: 3600,
        });

        return res.status(201).json({
            message: "Payment added successfully.",
            data: payment,
        });
    } catch (error) {
        console.error("Error in addPayment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
