import bcrypt from "bcrypt";
import { User } from "../Schema/RegisterUser.js";
import jwt from "jsonwebtoken";
import { redis } from "../DBConnection/redisConnect.js";

const JWT_SECRET = process.env.JWT_SECRET || "anjhs%#$vscd00nadjf%%^^*sd"



// export const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         console.log("Incoming register body:", req.body);

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "Please fill all Fields" });
//         }

//         const user = await User.findOne({ where: { email } });
//         if (user) {
//             return res.status(400).json({ message: "User Already Exists" }); // fixed typo `ststus`
//         }

//         const hashPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             name,
//             email,
//             password: hashPassword,
//         });

//         // 🔴 Store in Redis: Key = user:<id>, Value = JSON string of user data (excluding password)
//         const redisKey = `user:${newUser.id}`;
//         const redisData = JSON.stringify({
//             id: newUser.id,
//             name: newUser.name,
//             email: newUser.email,
//         });

//         await redis.set(redisKey, redisData); // or use setEx(redisKey, 3600, redisData) for TTL

//         // ✅ Return response
//         res.status(201).json({
//             message: "User Registered Successfully",
//             user: {
//                 id: newUser.id,
//                 name: newUser.name,
//                 email: newUser.email,
//             },
//         });

//     } catch (error) {
//         console.error("Error in Register User", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all Fields" });
        }

        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
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

        // ✅ Make sure to RETURN JSON properly
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

export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Incoming login body:", req.body);

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const user = await User.findOne({ where: { email } });
        console.log("User from DB:", user);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

        // ✅ Store JWT in Redis with expiration (1 day = 86400 seconds)
        await redis.setEx(`token:${user.id}`, 86400, token); // 'setEx' is preferred over deprecated 'set' with "EX"

        res.status(200).json({
            message: "User logged in successfully",
            token,
        });

    } catch (error) {
        console.error("Error in Login User", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
