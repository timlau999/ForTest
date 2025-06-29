import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Tables = sequelize.define(
  "Tables",
  {
    tableId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tableNumber: {
      type: DataTypes.INTEGER(45),
      allowNull: false,
      unique: true,
    },
    tableCapacity: {
      type: DataTypes.INTEGER(255),
        allowNull: false,
    },
    tablestates: {
      type: DataTypes.ENUM("available", "unavailable", "occupied", "reserved"),
      defaultValue: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default Tables;