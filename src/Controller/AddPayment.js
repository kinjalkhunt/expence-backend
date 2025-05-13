
import { InPay } from "../Schema/InPayment.js";
import moment from 'moment';  

import { redis } from "../DBConnection/redisConnect.js";

export const addPayment = async (req, res) => {
    try {
        const { amount, description, paymentMode, paymentDate } = req.body;
        const receiptFile = req.file; 
        

        if (!amount || !description || !paymentMode || !paymentDate) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Ensure paymentDate is formatted correctly
        const formattedPaymentDate = moment(paymentDate, 'YYYY-MM-DD', true).isValid()
            ? moment(paymentDate).toISOString()
            : new Date(paymentDate).toISOString();

        // Get the file path if a file was uploaded
        const receiptUrl = receiptFile ? `/uploads/receipts/${receiptFile.filename}` : undefined;

        const payment = await InPay.create({
            amount,
            description,
            paymentMode,
            paymentDate: formattedPaymentDate,
            receiptUrl,
        });
        await redis.del("payment"); // Add this after successful creation

        await redis.set(`payment:${payment.id}`, JSON.stringify(payment), {
            EX: 3600,
        });

        return res.status(201).json({
            message: "Payment added successfully.",
            data: payment,
        });
    } catch (error) {
        console.error("Error in addPayment:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};

export const getPayment = async (req, res) => {
    try {
        const cacheKey = "payment";
        const forceRefresh = req.query.forceRefresh === 'true'; // optional query param

        if (!forceRefresh) {
            const cachedPayments = await redis.get(cacheKey);
            if (cachedPayments) {
                return res.status(200).json({
                    message: "Payments received successfully (from cache)",
                    data: JSON.parse(cachedPayments),
                });
            }
        }

        // Fetch from DB if not in cache or forceRefresh is true
        const payments = await InPay.findAll({
            order: [["createdAt", "DESC"]],
        });

        await redis.set(cacheKey, JSON.stringify(payments), { EX: 30 }); // cache for 1 hour

        return res.status(200).json({
            message: "Payments received successfully (from database)",
            data: payments,
        });
    } catch (error) {
        console.error("Error in getPayment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
