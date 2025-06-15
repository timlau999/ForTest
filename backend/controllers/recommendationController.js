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
    console.log('Client allergens:', clientAllergens);

    return menuItems.filter((dish, index) => {
        const ingredients = dish.MenuItemIngredients.flatMap(mi => mi.Ingredient);
        const ingredientAllergens = ingredients.flatMap(ing => {
            return ing.name ? ing.name.toLowerCase().split(',').map(a => a.trim()) : [];
        });
        console.log(`  Dish ${dish.name} ingredient allergens:`, ingredientAllergens);
        
        if (ingredientAllergens.some(a => clientAllergens.includes(a))) {
            console.log(`  Dish ${dish.name} excluded due to allergen match`);
            return false;
        }

        console.log(`  Dish ${dish.name} included`);
        return true;
    });
}

// Generate AI prompt
function generatePrompt(client, dishes) {
    return `Customer Information:
- Medical Conditions: ${client.MedicalConditions || 'None'}
- Dietary Preferences: ${client.DietaryPreferences || 'None'}

Available Dishes:
${dishes.map(d => `[${d.name}]`).join(', ')}

Please recommend the three most suitable dishes based on the customer's dietary restrictions and health conditions from the "Available Dishes" list above. Reply with dish names enclosed in [], e.g., [Lasagna Rolls], [Vegan Sandwich], [Cheese Pasta].`;
}

// Get AI recommendation
async function getAIRecommendation(prompt) {
    try {
        const apiKey = 'ragflow-NjYjg3ZTU4MzE4ZTExZjBhN2RmMDI0Mm';
        const chatID = '5f9b44c2318f11f0a41b0242ac120006';
        const address = '34.234.143.101'; 

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

        const response = await axios.post(requestUrl, requestBody, { headers: requestHeaders });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI recommendation error:', error.message);
        return null;
    }
}

// Parse AI response with enhanced logic
function parseAIResponse(response) {
    if (!response) return [];
    
    response = response.replace(/<RichMediaReference>[\s\S]*?<\/think>/g, '').trim();
    
    const bracketedMatches = response.match(/\[([^\]]+)\]/g);
    if (bracketedMatches && bracketedMatches.length > 0) {
        return bracketedMatches.map(match => 
            match.replace(/^\[|\]$/g, '').trim()
        );
    }
    
    return response.split(/[,\n\s]+/)
        .map(name => name.trim())
        .filter(name => name.length > 0);
}

// Validate recommended dishes with flexible matching
function validateRecommendedDishes(recommendedDishes, menuItems) {
    const normalizedMenuMap = new Map();
    menuItems.forEach(item => {
        const normalizedName = normalizeDishName(item.name);
        normalizedMenuMap.set(normalizedName, item.name);
    });
    
    const validDishes = [];
    recommendedDishes.forEach(dish => {
        const normalizedDish = normalizeDishName(dish);
        if (normalizedMenuMap.has(normalizedDish)) {
            validDishes.push(normalizedMenuMap.get(normalizedDish));
        }
    });
    
    return validDishes;
}

// Normalize dish name for comparison
function normalizeDishName(name) {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim();
}

// Get random dishes from available menu
function getRandomDishes(menuItems, count = 3) {
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(item => item.name);
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
        filteredDishes = filteredDishes.filter(dish => dish.category !== 'Deserts');

        const prompt = generatePrompt(client, filteredDishes);
        console.log('AI Request Prompt:', prompt);  

        const aiResponse = await getAIRecommendation(prompt);
        console.log('AI Raw Response:', aiResponse);

        const parsedDishes = parseAIResponse(aiResponse);
        const validDishes = validateRecommendedDishes(parsedDishes, menuItems);
        
        console.log('Parsed Dishes:', parsedDishes);
        console.log('Valid Dishes:', validDishes);

        let finalRecommendedDishes = [];
        let recommendationSource = 'AI';

        if (validDishes.length >= 3) {
            await Recommendation.destroy({ where: { customerId } });
            
            // 使用事务确保数据一致性
            await sequelize.transaction(async (t) => {
                for (let i = 0; i < 3; i++) {
                    const dishName = validDishes[i];
                    const menuItem = await MenuItem.findOne({ where: { name: dishName } }, { transaction: t });
                    if (menuItem) {
                        // 显式计算并设置 recommendationId
                        const recommendationId = parseInt(customerId.toString() + (i + 1));
                        
                        await Recommendation.create({
                            recommendationId,
                            customerId,
                            menuItemId: menuItem.menuItemId
                        }, { transaction: t });
                        
                        finalRecommendedDishes.push(dishName);
                    }
                }
            });
            
            console.log('Using AI recommendation:', finalRecommendedDishes);
        } else {
            recommendationSource = 'Random';
            const randomDishes = getRandomDishes(filteredDishes);
            
            await Recommendation.destroy({ where: { customerId } });
            
            // 使用事务确保数据一致性
            await sequelize.transaction(async (t) => {
                for (let i = 0; i < 3; i++) {
                    const dishName = randomDishes[i];
                    const menuItem = await MenuItem.findOne({ where: { name: dishName } }, { transaction: t });
                    if (menuItem) {
                        // 显式计算并设置 recommendationId
                        const recommendationId = parseInt(customerId.toString() + (i + 1));
                        
                        await Recommendation.create({
                            recommendationId,
                            customerId,
                            menuItemId: menuItem.menuItemId
                        }, { transaction: t });
                        
                        finalRecommendedDishes.push(dishName);
                    }
                }
            });
            
            console.log('Using random recommendation:', finalRecommendedDishes);
        }

        const responseData = {
            recommendation: finalRecommendedDishes.join(', ') || "AI recommendation service is temporarily unavailable",
            recommendationSource,
            aiOriginalResponse: aiResponse || 'No response from AI service',
            parsedDishes,
            validDishes
        };

        console.log('Final recommendation result:', responseData);
        
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(responseData, null, 2));

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
