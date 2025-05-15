import { DataTypes } from "sequelize";
import { sequelize } from "../DBConnection/dbConnect.js";

export const OutExpence = sequelize.define("OutExpence", {
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
        type: DataTypes.ENUM("CASH", "ONLINE"), // Better than using NUMBER
        allowNull: false,
    },
    expenseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    receiptUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for the uploaded receipt
    },
}, {
    tableName: "OutExpenses",
    timestamps: true,
});