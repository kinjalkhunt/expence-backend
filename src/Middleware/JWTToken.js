// middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { redis } from "../DBConnection/redisConnect.js";

const JWT_SECRET = process.env.JWT_SECRET || "anjhs%#$vscd00nadjf%%^^*sd";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is in Redis
    const redisToken = await redis.get(`user:${decoded.id}`);
    if (redisToken !== token) {
      return res.status(401).json({ message: "Token is expired or invalid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
