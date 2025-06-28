import MenuItem from '../models/menuItemModel.js';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import fs from 'fs';
import Review from '../models/reviewModel.js';
import { Op } from 'sequelize';
import MenuItemIngredient from '../models/menuItemIngredientModel.js';
import Ingredient from '../models/ingredientModel.js';
import Customer from '../models/customerModel.js';

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
    const { menuItemId, userId } = req.query;
    try {
        let userData = await Admin.findOne({ where: { userId: userId } });
        if (userData) {
            const menuItem = await MenuItem.findOne({ where: { menuItemId: menuItemId } });
            //fs.unlink(`uploads/${menuItem.image}`, () => {});
            await MenuItemIngredient.destroy({where: { menuItemId }});
            await MenuItem.destroy({where: { menuItemId }});
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
                    attributes: ['ingredientId','name']
                }
            ]
        });

        const ingredients = menuItemIngredients.map(item => 
            ({
            ingredientId: item.Ingredient.ingredientId,
            name: item.Ingredient.name
            })
        );
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

const editMenuItemIngredients = async (req, res) => {
    try {
        const menuItemId = req.body.menuItemId;
        const ingredients = req.body.ingredientsIds;
        console.log('Received menuItemId:', menuItemId);
        console.log('Received ingredients:', ingredients);

        if (!menuItemId || !ingredients) {
            return res.status(400).json({ success: false, message: 'Menu item ID and ingredients are required' });
        }

        await MenuItemIngredient.destroy({ where: { menuItemId } });

        const ingredientIds = Array.isArray(ingredients) ? ingredients : [ingredients];
        const menuItemIngredients = ingredientIds.map(ingredientId => ({
            menuItemId,
            ingredientId
        }));

        await MenuItemIngredient.bulkCreate(menuItemIngredients);
        res.json({ success: true, message: 'Menu item ingredients updated successfully' });
        
    } catch (error) {
        console.error('Error updating menu item ingredients:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getReviewsA = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log('Received userId:', userId);
        const response = await Customer.findOne({
            where: { userId: userId }
        });
        const responseB = await Review.findAll({
            where: { CustomerId: response.customerId },
        });
        console.log('Reviews fetched successfully:', responseB);
        if (!responseB) {
            return res.json({ success: false, message: 'No reviews found' });
        }
        console.log('Reviews fetched successfully:', responseB);
        res.json({ success: true, data: responseB });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.json({ success: false, message: 'Server error' });
    }
};

export { getIngredients, addMenuItem, listMenuItems, removeMenuItem, editMenuItem, getMenuItemIngredients, getMenuItemReviews, editMenuItemIngredients, getReviewsA };