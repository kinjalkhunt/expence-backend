// logoutController.ts

import { redis } from "../DBConnection/redisConnect.js";
import { User } from "../Schema/RegisterUser.js";

export const logoutUser = async (req, res) => {
  try {
    const { token } = req.body; // You can send the token from the client for validation

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify token and decode user data
    jwt.verify(token, process.env.JWT_SECRET || "anjhs%#$vscd00nadjf%%^^*sd", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Invalidate the token from Redis
      const redisTokenKey = `token:${decoded.id}`;
      await redis.del(redisTokenKey); // Remove token from Redis

      // Optionally, you can also handle the cookie (if you're using cookies)
      res.clearCookie("token"); // If token is stored in a cookie

      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error in Logout User", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
