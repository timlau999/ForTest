    import axios from 'axios';
    import express from 'express';

    const getOpenFoodData = async (req, res) => {
    const { term } = req.body;
    try{
        const response = await axios.get('https://api.spoonacular.com/food/ingredients/search', {
            params: {
            apiKey: '34193f37f9a94e108526c1facb04e52d',
            query: term,
            number: 3,
            },
        });
            console.log(response.data.results);
            res.json({ success: true, data: response.data.results });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch nutrition data' });
            res.json({ success: false});
        };
    }

    const getOpenFoodDetail = async (req, res) => {
        const { id } = req.body;
        try{
            const response = await axios.get(`https://api.spoonacular.com/food/ingredients/${id}/information`, {
                params: {
                    apiKey: '34193f37f9a94e108526c1facb04e52d',
                    amount: 1,
                    id: id,
                },
            });
            console.log(response.data.nutrition.nutrients);
            res.json({ success: true, data: response.data.nutrition.nutrients , data2: response.data.nutrition.weightPerServing });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch nutrition data' });
            res.json({ success: false});
        };
    }

    export {getOpenFoodData,getOpenFoodDetail };