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
- Name: ${client.Name || 'Unknown'}
- Allergens: ${client.Allergens || 'None'}
- Medical Conditions: ${client.MedicalConditions || 'None'}
- Dietary Preferences: ${client.DietaryPreferences || 'None'}

Available Dishes:
${dishes.map(d => `[${d.name}] Calories: ${d.calories}`).join('\n')}

IMPORTANT: You MUST strictly follow the formatting instructions below. Please recommend the most suitable three dishes based on the customer's dietary restrictions and health conditions. Under NO circumstances should you add any additional words, explanations, or formatting. Each dish name MUST be individually enclosed in <>, like this: <Lasagna Rolls>, <Vegan Sandwich>, <Cheese Pasta>. This is a non - negotiable requirement. Do not combine multiple dish names within a single set of <>. ONLY provide the three dish names in the specified format, nothing else.`;
}

// Get AI recommendation
async function getAIRecommendation(prompt) {
    try {
        const apiKey = 'ragflow-E5YWRkNGE2MjVhNzExZjBiYTJhMDI0Mm';
        const chatID = '9fe6964c25a711f099c20242ac120006';
        const address = '192.168.0.179';

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

        // Filter menu items based on customer profile
        const filteredDishes = filterMenuForClient(client, menuItems);

        const prompt = generatePrompt(client, filteredDishes);
        let recommendation = await getAIRecommendation(prompt);

        // Remove <think> and </think> tags and their contents
        if (recommendation) {
            recommendation = recommendation.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }

        // Extract recommended menu item names and remove < >
        const recommendedDishes = recommendation.split(',').map(dish => {
            return dish.replace(/[<>]/g, '').trim();
        });

        // Insert recommendations into the database
        for (const dishName of recommendedDishes) {
            const menuItem = await MenuItem.findOne({ where: { name: dishName } });
            if (menuItem) {
                await Recommendation.create({
                    customerId: customerProfile.customerId,
                    menuItemId: menuItem.menuItemId
                });
            }
        }

        const responseData = {
            client: customerProfile.customerId,
            suitable_dishes: filteredDishes.map(d => d.name),
            recommendation: recommendedDishes.slice(0, 3).map(dish => `<${dish}>`).join(', ') || "AI recommendation service is temporarily unavailable"
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(responseData, (key, value) => {
            return value === undefined ? null : value;
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
