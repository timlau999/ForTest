// restaurant_b02/frontend/src/components/AIRecommendationPopup/AIRecommendationPopup.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './AIRecommendationPopup.css';

const AIRecommendationPopup = ({ onClose, customerId, backendUrl }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const [recommendationData, setRecommendationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]); 

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/menuitem`);
                setAllMenuItems(response.data.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
                setError('Failed to fetch menu items. Please try again later.');
            }
        };
        fetchMenuItems();
    }, [backendUrl]);

    const fetchRecommendation = useCallback(async () => {
        try {
            if (!customerId) {
                setError('Customer ID is missing. Please log in or try again.');
                return;
            }
            const response = await axios.post(`${backendUrl}/api/recommend`, { customerId });
            setRecommendationData(response.data);
            const recommendedDishes = response.data.recommendation.split(', ');

            const matchedItems = recommendedDishes.map(dish => {
                return allMenuItems.find(item => item.name === dish) || null;
            }).filter(item => item !== null); 

            setMenuItems(matchedItems);
        } catch (error) {
            console.error('Error fetching recommendation:', error);
            setError('Failed to fetch recommendation. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [customerId, backendUrl, allMenuItems]);

    useEffect(() => {
        if (allMenuItems.length > 0) {
            fetchRecommendation();
        }
    }, [fetchRecommendation, allMenuItems]);

    return (
        <div className="ai-popup">
            <div className="ai-popup-container">
                <div className="ai-popup-title">
                    <h2>AI Recommended Dishes</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="ai-popup-content">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : menuItems.length > 0 ? (
                        menuItems.map(item => (
                            <div key={item._id} className='menuItem-item'>
                                <div className="menuItem-item-img-container">
                                    <img className='menuItem-item-image' src={`/menuItem_${item._id}.png`} alt={item.name} />
                                    {!cartItems[item._id] ? (
                                        <img className="add" onClick={() => addToCart(item._id)} src="/add_icon_white.png" alt="Add to cart" />
                                    ) : (
                                        <div className='menuItem-item-counter'>
                                            <img onClick={() => removeFromCart(item._id)} src="/remove_icon_red.png" alt="Remove from cart" />
                                            <p>{cartItems[item._id]}</p>
                                            <img onClick={() => addToCart(item._id)} src="/add_icon_green.png" alt="Add to cart" />
                                        </div>
                                    )}
                                </div>
                                <div className="menuItem-item-info">
                                    <div className="menuItem-item-name-rating">
                                        <p>{item.name}</p>
                                        <img src="/rating_starts.png" alt="Rating stars" />
                                    </div>
                                    <p className="menuItem-item-desc">
                                        {item.description}
                                    </p>
                                    <p className="menuItem-item-price">${item.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recommendation data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecommendationPopup;
