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
      },
    },
    tableId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tables,
        key: "tableId",
      },
    },
    reservationTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reservationStatus: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
    },
    reservationUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

Tables.belongsToMany(User, {through: Reservation,});
User.belongsToMany(Tables, {through: Reservation,});

export default Reservation;