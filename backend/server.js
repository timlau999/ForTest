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
import openfooddataRouter from "./routes/openfooddataRoute.js";
import pointsRouter from "./routes/pointsRoute.js";
import CustomerPoints from "./models/customerPointsModel.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import optionRouter  from "./routes/optionRoute.js";
import http from "http";
import {Server} from "socket.io";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server (server, {
    cors: {
//        origin: ['http://localhost:5173', 'http://localhost:5174'],
	  origin: ['http://smart.restaurant.vtcb02.tech', 'http://smart.restaurant.vtcb02.tech/admin'],
	  methods: ["GET", "POST"],
    },
    });
io.on('connection', (socket) => {
  const role = socket.handshake.query.role;
  console.log('Client connected:', role, socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', role, socket.id);
  });
});
app.set('io', io);

connectDB();

MenuItem.hasMany(MenuItemIngredient, { foreignKey: 'menuItemId' });
MenuItemIngredient.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItemIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

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
app.use("/api/openfooddata", openfooddataRouter);
app.use('/api/points', pointsRouter);
app.use('/api', paymentRoutes);
app.use('/api/options', optionRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

server.listen(port, () => {
    console.log(`Server Started on port: ${port}`);
});
