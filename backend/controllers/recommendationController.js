import CustomerProfile from '../models/customerProfileModel.js';
import MenuItem from '../models/menuItemModel.js';
import MenuItemIngredient from '../models/menuItemIngredientModel.js';
import Ingredient from '../models/ingredientModel.js';
import axios from 'axios';
import Recommendation from '../models/recommendationModel.js';
import sequelize from '../config/db.js';

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
- Allergens: ${client.Allergens || 'None'}
- Medical Conditions: ${client.MedicalConditions || 'None'}
- Dietary Preferences: ${client.DietaryPreferences || 'None'}

Available Dishes:
${dishes.map(d => `[${d.name}]`)}

Please recommend the three most suitable dishes based on the customer's dietary restrictions and health conditions from the "Available Dishes" list above. You can only reply with the name of the dish, no need to reply with other.
Each dish name MUST be individually enclosed in [], like this: [Lasagna Rolls], [Vegan Sandwich], [Cheese Pasta]. Do not combine multiple dish names within a single set of [].`;
}

// Get AI recommendation
async function getAIRecommendation(prompt) {
    try {
        const apiKey = 'ragflow-E5YWRkNGE2MjVhNzExZjBiYTJhMDI0Mm';
        const chatID = 'abf05ad82fa511f0a61d0242ac150006';
        const address = '192.168.0.179';

     /*   const apiKey = 'ragflow-NjYjg3ZTU4MzE4ZTExZjBhN2RmMDI0Mm';
        const chatID = '5f9b44c2318f11f0a41b0242ac120006';
        const address = '34.234.143.101';  */


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

export const getRecommendation = async (req, res) => {
    try {
        const { customerId } = req.body;
        if (!customerId) {
            return res.status(400).json({ error: 'Missing customerId parameter' });
        }

        const customerProfile = await CustomerProfile.findOne({ where: { customerId } });
        if (!customerProfile) {
            return res.status(404).json({ error: 'Customer profile not found' });
        }

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

																		
        let filteredDishes = filterMenuForClient(client, menuItems);
        filteredDishes = filteredDishes.filter(dish => dish.category!== 'Deserts');

        const prompt = generatePrompt(client, filteredDishes);
        let recommendation = await getAIRecommendation(prompt);

        if (recommendation) {
            recommendation = recommendation.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }

        const recommendedDishes = recommendation? recommendation.split(',').map(dish => {
            return dish.replace(/^\s*\[\s*|\s*\]\s*$/g, '').trim();
        }) : [];

        const validRecommendedDishes = recommendedDishes.filter(dish => {
            return menuItems.some(item => item.name === dish);
        });

        let finalRecommendedDishes = [];
        if (validRecommendedDishes.length > 0) {
            await Recommendation.destroy({ where: { customerId: customerProfile.customerId } });
	    await sequelize.query('ALTER TABLE recommendation AUTO_INCREMENT = 1;');
            for (const dishName of validRecommendedDishes.slice(0, 3)) {
                const menuItem = await MenuItem.findOne({ where: { name: dishName } });
                if (menuItem) {
                    await Recommendation.create({
                        customerId: customerProfile.customerId,
                        menuItemId: menuItem.menuItemId
                    });
                    finalRecommendedDishes.push(dishName);
                }
            }
        } else {
            const existingRecommendations = await Recommendation.findAll({
                where: { customerId: customerProfile.customerId },
                include: [{
                    model: MenuItem
                }]
            });
            finalRecommendedDishes = existingRecommendations.map(recommendation => recommendation.MenuItem.name);
        }

        const responseData = {
            recommendation: finalRecommendedDishes.slice(0, 3).join(', ') || "AI recommendation service is temporarily unavailable"
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(responseData, (key, value) => {
            return value === undefined? null : value;
        }, 2) + '\n');

    } catch (error) {
        console.error('Server error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }
    }
};

