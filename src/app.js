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
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ✅ Serve uploads statically here (correct location)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Mount all versioned routes
app.use("/v1", routes);

const port = process.env.PORT || 8000;
dbConnect();
redisConnect();
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
