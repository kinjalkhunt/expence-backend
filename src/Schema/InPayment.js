import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../DBConnection/dbConnect.js";

export const InPay = sequelize.define("InPayment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Use `allowNull`, not `require`
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentMode: {
        type: DataTypes.ENUM("cash", "online"), // Better than using NUMBER
        allowNull: false,
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    receiptUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for the uploaded receipt
    },
}, {
    tableName: "InPayments", // Optional: set a custom table name
    timestamps: true, // Adds createdAt and updatedAt
});
