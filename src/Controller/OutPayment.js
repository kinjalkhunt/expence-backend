import moment from "moment";
import { OutExpence } from "../Schema/OutPayment.js";
import { redis } from "../DBConnection/redisConnect.js";

// Post api
export const addOutExpense = async (req, res) => {
  try {
    const { amount, description, paymentMode, expenseDate } = req.body;
    const billFile = req.file;
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    if (!amount || !description || !paymentMode || !expenseDate) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const formattedDate = moment(expenseDate, 'YYYY-MM-DD', true).isValid()
      ? moment(expenseDate).toISOString()
      : new Date(expenseDate).toISOString();

    const receiptUrl = billFile ? `/uploads/receipts/${billFile.filename}` : undefined;

    const expense = await OutExpence.create({
      amount,
      description,
      paymentMode,
      expenseDate: formattedDate,
      receiptUrl,
    });

    await redis.del("outexpense");

    await redis.set(`outexpense:${expense.id}`, JSON.stringify(expense), { EX: 30 });

    return res.status(201).json({ message: "Expense recorded successfully", data: expense });
  } catch (error) {
    console.error("Error in addOutExpense:", error);
    return res.status(500).json({
      message: "Internal server error", error: error.message
    });
  }
};
// get Api
export const GetPayment = async (req, res) => {
  try {
    // Check Redis cache first
    const cachedData = await redis.get("outexpense");

    if (cachedData) {
      return res.status(200).json({
        message: "Fetched from cache",
        data: JSON.parse(cachedData),
      });
    }

    // If not in cache, fetch from DB
    const expenses = await OutExpence.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Save to Redis for 1 hour (3600 seconds)
    await redis.set("outexpense", JSON.stringify(expenses), { EX: 100 });

    return res.status(200).json({
      message: "Fetched from database",
      data: expenses,
    });
  } catch (error) {
    console.error("Error in getOutExpenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}