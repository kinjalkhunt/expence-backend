import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { dbConnect } from './DBConnection/dbConnect.js';
import { redisConnect } from './DBConnection/redisConnect.js';
import { routes } from './Routes/index.js';

export const app = express();
dotenv.config();

app.use(cors({
  origin: "*" ,//'http://localhost:5173' , 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Global error handler for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === "Unsupported file type") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/v1", routes);

const port = process.env.PORT || 8000;
dbConnect();
redisConnect();
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
