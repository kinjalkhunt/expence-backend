import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME_POST || "ExpenceTracker",
    process.env.DB_USER_POST || "postgres",
    process.env.DB_PASSWORD_POST || "kinjal",
    {
        host: process.env.DB_HOST_POST || "localhost",
        dialect: process.env.DB_DIALECT_POST || "postgres",
        port: process.env.DB_PORT_POST || 5500,
        logging:false
    }

)

export const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Postgre Database Connected Successfully");
        
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

    } catch (error) {
        console.log("Error in DB Connection", error);
    }
}