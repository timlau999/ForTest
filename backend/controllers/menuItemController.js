import MenuItem from '../models/menuItemModel.js';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import fs from 'fs';
import Review from '../models/reviewModel.js';
import { Op } from 'sequelize';
import MenuItemIngredient from '../models/menuItemIngredientModel.js';
import Ingredient from '../models/ingredientModel.js';

const getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.json({ success: true, data: ingredients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// add menuItem items
const addMenuItem = async (req, res) => {
    try {
        let userData = await Admin.findOne({ where: { userId: req.body.userId } });
        if (userData) {
            const newMenuItem = await MenuItem.create({
                menuID: req.body.menuID,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                calories: req.body.calories,
                category: req.body.category,
                //image: image_filename
            });

            const menuItemId = newMenuItem.menuItemId;
            let ingredientIds = req.body.ingredients;
            if (!Array.isArray(ingredientIds)) {
                ingredientIds = ingredientIds ? [ingredientIds] : [];
            }

            if (ingredientIds.length > 0) {
                const menuItemIngredients = ingredientIds.map(ingredientId => ({
                    menuItemId,
                    ingredientId
                }));

                await MenuItemIngredient.bulkCreate(menuItemIngredients);
            }
            
            res.json({ success: true, message: "MenuItem Added" });
        } else {
            res.json({ success: false, message: "You are not admin" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// remove menuItem item
const removeMenuItem = async (req, res) => {
    try {
        let userData = await User.findOne({ where: { id: req.body.userId } });
        if (userData && userData.role === "admin") {
            const menuItem = await MenuItem.findOne({ where: { id: req.body.id } });
            fs.unlink(`uploads/${menuItem.image}`, () => {});
            await menuItem.destroy();
            res.json({ success: true, message: "MenuItem Removed" });
        } else {
            res.json({ success: false, message: "You are not admin" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({ attributes: ['menuItemId', 'menuID', 'name', 'description', 'price', 'category', 'calories'] });
        const formattedMenuItems = await Promise.all(menuItems.map(async (item) => {
            const reviews = await Review.findAll({
                where: {
                    menuItemId: item.menuItemId
                }
            });
            let totalRating = 0;
            if (reviews.length > 0) {
                totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            }
            return {
                _id: item.menuItemId.toString(),
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                image: `menuItem_${item.menuItemId}.png`,
                category: item.category,
                calories: item.calories,
                rating: totalRating
            };
        }));

        const nonZeroRatingItems = formattedMenuItems.filter(item => item.rating!== 0);
        nonZeroRatingItems.forEach(item => {
            console.log(`MenuItem: ${item.name}, Rating: ${item.rating}`);
        });

        res.json({ success: true, data: formattedMenuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const editMenuItem = async (req, res) => {
    try {
        let userData = await Admin.findOne({ where: { userId: req.body.userId } });
        if (userData) {
            const menuItem = await MenuItem.findOne({ where: { menuItemId: req.body.menuItemId } });
            if (menuItem) {
                const response = await MenuItem.update(
                    {
                        menuID: req.body.menuId,
                        name: req.body.name,
                        description: req.body.description,
                        price: req.body.price,
                        calories: req.body.calories,
                        category: req.body.category,
                        //image: `${req.file.filename}`
                    },
                    { where: { menuItemId: req.body.menuItemId } }
                );
                res.json({ success: true, message: "MenuItem Updated" });
            } else {
                res.json({ success: false, message: "MenuItem not found" });
            }
        } else {
            res.json({ success: false, message: "You are not admin" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getMenuItemIngredients = async (req, res) => {
    try {
        const { menuItemId } = req.query;
        const menuItemIngredients = await MenuItemIngredient.findAll({
            where: { menuItemId },
            include: [
                {
                    model: Ingredient,
                    attributes: ['name']
                }
            ]
        });

        const ingredients = menuItemIngredients.map(item => item.Ingredient.name);
        res.json({ success: true, data: ingredients });
    } catch (error) {
        console.error('Error fetching menu item ingredients:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMenuItemReviews = async (req, res) => {
    try {
        const { menuItemId } = req.query;
        const reviews = await Review.findAll({
            where: {
                menuItemId
            }
        });
        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Error fetching menu item reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { getIngredients, addMenuItem, listMenuItems, removeMenuItem, editMenuItem, getMenuItemIngredients, getMenuItemReviews };