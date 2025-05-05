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
      type: DataTypes.ENUM("available", "occupied", "reserved"),
      defaultValue: "available",
    },
    tableupdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  
);

export default Tables;