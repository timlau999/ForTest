// ForTest/backend/controllers/optionController.js
import Ingredient from '../models/ingredientModel.js';
import MedicalCondition from '../models/medicalConditionModel.js';
import DietaryPreference from '../models/dietaryPreferenceModel.js';

export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching ingredients' });
  }
};

export const getAllMedicalConditions = async (req, res) => {
  try {
    const conditions = await MedicalCondition.findAll();
    res.status(200).json({ success: true, data: conditions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching medical conditions' });
  }
};

export const getAllDietaryPreferences = async (req, res) => {
  try {
    const preferences = await DietaryPreference.findAll();
    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching dietary preferences' });
  }
};