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
        allowNull: false, 
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentMode: {
        type: DataTypes.ENUM("cash", "online"), 
        allowNull: false,
    },
    expenseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    receiptUrl: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
}, {
    tableName: "InPayments", 
    timestamps: true, 
});
