

import { redis } from "../DBConnection/redisConnect.js";
import { InPay } from "../Schema/InPayment.js";
import moment from 'moment';  

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

export const getPayment = async (req, res) => {
    try {
        const cachKey = "payment: all";
        const cachedPayments = await redis.get(cachKey);

        if(cachedPayments) {
            return res.status(200).json({
                message: "payments received successfully (from cache)",
                data: JSON.parse(cachedPayments)
            })
        }

        const payments = await InPay.findAll({
            order: [["createdAt", "DESC"]]
        });
        await redis.set(cachKey, JSON.stringify(payments), { EX: 3600});

        return res.status(200).json({
            message: "Payments received successfully.",
            data: payments,
        })
    } catch (error) {
        console.error("Error in getPayment:", error);
        return res.status(500).json({ message: "Internal server error" });

        
    }
}