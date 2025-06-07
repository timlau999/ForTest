import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import Tables from "./tablesModel.js";
import User from "./userModel.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    reservationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userId",
        allowNull: false,
      },
    },
    tableId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tables,
        key: "tableId",
        allowNull: false,
      },
    },
    timeslot: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reservationStatus: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default Reservation;