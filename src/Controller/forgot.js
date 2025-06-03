// / import jwt from "jsonwebtoken";
// // import { User } from "../models/User.js";
// // import { redis } from "../redisConnection.js"; // adjust as needed
const RESET_SECRET = "your-reset-secret"; // 🔐 Keep it safe

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: "15m" });

        // Save token in Redis with expiration
        await redis.setEx(`reset:${user.id}`, 900, resetToken); // 900 seconds = 15 minutes

        // Simulate sending email (you'd normally use nodemailer or other email service)
        const resetLink = `http://your-frontend.com/reset-password/${resetToken}`;

        console.log("Reset link:", resetLink); // ✉️ Simulate sending email

        return res.status(200).json({
            message: "Password reset link has been sent to your email",
            // ⚠️ Do not send the link in production response
            resetLink // for dev/testing only
        });

    } catch (error) {
        console.error("Error in forgotPassword", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


import bcrypt from "bcrypt";

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; // token comes from reset link
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, RESET_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const storedToken = await redis.get(`reset:${decoded.id}`);
        if (!storedToken || storedToken !== token) {
            return res.status(400).json({ message: "Token expired or invalid" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.update(
            { password: hashedPassword },
            { where: { id: decoded.id } }
        );

        await redis.del(`reset:${decoded.id}`); // Remove token after use

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Error in resetPassword", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// routes/auth.js
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const redisKey = `user:${newUser.id}`;
    const redisData = JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
    await redis.set(redisKey, redisData);

    return res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Error in Register User", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
