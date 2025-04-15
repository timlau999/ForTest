// ForTest/backend/routes/recommendationRoute.js
import express from 'express';
import sequelize from '../config/db.js';
import CustomerProfile from '../models/customerProfileModel.js';
import MenuItem from '../models/menuItemModel.js';
import MenuItemIngredient from '../models/menuItemIngredientModel.js';
import Ingredient from '../models/ingredientModel.js';

const router = express.Router();

router.post('/recommend', async (req, res) => {
    try {
        const { customerId } = req.body;
        if (!customerId) return res.status(400).json({ error: 'Missing customerId parameter' });

        const customerProfile = await CustomerProfile.findOne({ where: { customerId } });
        if (!customerProfile) return res.status(404).json({ error: 'Customer profile not found' });

        const menuItems = await MenuItem.findAll({
            include: [
                {
                    model: MenuItemIngredient,
                    include: [Ingredient]
                }
            ]
        });

        const client = {
            Allergens: customerProfile.allergy,
            MedicalConditions: customerProfile.medicalConditions,
            DietaryPreferences: customerProfile.dietaryPreference
        };

        // Filter menu items based on customer profile
        const filteredDishes = filterMenuForClient(client, menuItems);

        const prompt = generatePrompt(client, filteredDishes);
        let recommendation = await getAIRecommendation(prompt);

        // Remove <think> and </think> tags and their contents
        if (recommendation) {
            recommendation = recommendation.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }

        const responseData = {
            client: customerProfile.customerId,
            suitable_dishes: filteredDishes.map(d => d.name),
            recommendation: (recommendation || "AI recommendation service is temporarily unavailable")
              .replace(/\\n/g, '\n')
              .replace(/\s{2,}/g, ' ')
              .trim()
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(responseData, (key, value) => {
            return value === undefined ? null : value;
        }, 2) + '\n');

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Filter menu items based on customer profile
function filterMenuForClient(client, menuItems) {
    const clientAllergens = client.Allergens ? client.Allergens.toLowerCase().split(',').map(a => a.trim()) : [];
    const clientConditions = client.MedicalConditions ? client.MedicalConditions.toLowerCase().split(',').map(c => c.trim()) : [];
    const dietaryPref = client.DietaryPreferences ? client.DietaryPreferences.toLowerCase() : '';

    return menuItems.filter(dish => {
        const dishAllergens = dish.sensitiveSource ? dish.sensitiveSource.toLowerCase().split(',').map(a => a.trim()) : [];
        if (dishAllergens.some(a => clientAllergens.includes(a))) return false;

        const ingredients = dish.MenuItemIngredients.flatMap(mi => mi.Ingredient.name.toLowerCase());
        const nonVegetarianKeywords = ['meat', 'pork', 'beef', 'chicken', 'fish', 'seabass', 'shellfish'];
        const isVegetarian = !ingredients.some(ing => nonVegetarianKeywords.includes(ing));

        if (dietaryPref === 'vegetarian' && !isVegetarian) return false;

        return true;
    });
}

// Generate AI prompt
function generatePrompt(client, dishes) {
    return `Customer Information:
- Name: ${client.Name || 'Unknown'}
- Allergens: ${client.Allergens || 'None'}
- Medical Conditions: ${client.MedicalConditions || 'None'}
- Dietary Preferences: ${client.DietaryPreferences || 'None'}

Available Dishes:
${dishes.map(d => `[${d.name}] Ingredients: ${d.MenuItemIngredients.map(mi => mi.Ingredient.name).join(', ')}, Allergens: ${d.sensitiveSource || "None"}, Calories: ${d.calories}`).join('\n')}

Please recommend the most suitable dishes based on the customer's dietary restrictions and health conditions, and explain the reasons. You can recommend a maximum of three dishes, and the reason for each dish should be limited to 10 characters: `;
}

// Get AI recommendation
async function getAIRecommendation(prompt) {
    try {
        const apiKey = 'ragflow-Y0ODcwZDU0MGRkNjExZjBiYmFjMDI0Mm';
        const chatID = 'b759201e095b11f0b2b50242ac120006';
        const address = '192.168.0.172';

        const requestUrl = `http://${address}/api/v1/chats_openai/${chatID}/chat/completions`;
        const requestBody = {
            model: 'model',
            messages: [{"role": "user", "content": prompt}],
            stream: false
        };
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        console.log('Request URL:', requestUrl);
        console.log('Request Headers:', requestHeaders);
        console.log('Request Body:', requestBody);

        const response = await axios.post(requestUrl, requestBody, {
            headers: requestHeaders
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI recommendation error:', error.response?.data || error.message);
        return null;
    }
}

export default router;