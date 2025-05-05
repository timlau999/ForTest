// ForTest/backend/server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import sequelize from './config/db.js';
import menuItemRouter from "./routes/menuItemRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import recommendationRouter from "./routes/recommendationRoute.js";
import menuRouter from "./routes/menuRoutes.js";
import MenuItem from "./models/menuItemModel.js";
import MenuItemIngredient from "./models/menuItemIngredientModel.js";
import Ingredient from "./models/ingredientModel.js";
import Order from "./models/orderModel.js";
import tableRouter from "./routes/tableRouter.js";
import OrderItem from "./models/orderItemModel.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

connectDB();

MenuItem.hasMany(MenuItemIngredient, { foreignKey: 'menuItemId' });
MenuItemIngredient.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItemIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

// 指定别名 orderItems
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

sequelize.sync({ force: false, alter: false }).then(() => {
    console.log('Database synchronized');
});

app.use("/api/menus", menuRouter);
app.use("/api/menuItem", menuItemRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/recommend", recommendationRouter);
app.use("/api/table", tableRouter);								   
//app.use('/api/points', pointsRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on port: ${port}`);
});