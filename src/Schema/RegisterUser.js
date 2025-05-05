import { DataTypes } from "sequelize";
import { sequelize } from "../DBConnection/dbConnect.js";

export const User = sequelize.define("registerUser", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true // 👈 Prevents pluralization
});
