import express from "express";
import { addMenuItem, listMenuItems, removeMenuItem, editMenuItem, getMenuItemIngredients, getIngredients, getMenuItemReviews  } from "../controllers/menuItemController.js";
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
menuItemRouter.post("/edit", upload.single("image"), authMiddleware, editMenuItem); 
menuItemRouter.get('/ingredients', getIngredients);
menuItemRouter.get('/menuItemingredients', getMenuItemIngredients);
menuItemRouter.get('/reviews', getMenuItemReviews );

export default menuItemRouter;
