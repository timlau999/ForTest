// restaurant_b02/backend/routes/optionRoute.js
import express from 'express';
import { getAllIngredients, getAllMedicalConditions, getAllDietaryPreferences } from '../controllers/optionController.js';

const router = express.Router();

router.get('/ingredients', getAllIngredients);
router.get('/medical-conditions', getAllMedicalConditions);
router.get('/dietary-preferences', getAllDietaryPreferences);

export default router;