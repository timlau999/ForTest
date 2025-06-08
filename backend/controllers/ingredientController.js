// ForTest/backend/controllers/ingredientController.js
import Ingredient from '../models/ingredientModel.js';

export const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.status(200).json({ success: true, data: ingredients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching ingredients' });
    }
};