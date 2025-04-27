// ForTest/backend/routes/menuItemRoute.js
import express from "express";
import { listMenuItems } from "../controllers/menuItemController.js";

const menuItemRouter = express.Router();

menuItemRouter.get("/", listMenuItems);

export default menuItemRouter;