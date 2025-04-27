import express from "express";
import { addMenuItem, listMenuItems, removeMenuItem } from "../controllers/menuItemController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const menuItemRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

menuItemRouter.get("/", listMenuItems);
menuItemRouter.post("/add", upload.single("image"), authMiddleware, addMenuItem);
menuItemRouter.post("/remove", authMiddleware, removeMenuItem);

export default menuItemRouter;
