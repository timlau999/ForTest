// ForTest/frontend/src/components/AIRecommendationPopup/AIRecommendationPopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AIRecommendationPopup.css';

const AIRecommendationPopup = ({ onClose, customerId }) => {
    const [recommendationData, setRecommendationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await axios.post('http://192.168.0.174:4000/api/recommend', { customerId });
                setRecommendationData(response.data);
            } catch (error) {
                console.error('Error fetching recommendation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (customerId) {
            fetchRecommendation();
        }
    }, [customerId]);

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
                    ) : recommendationData ? (
                        <div>
                            <h3>Customer: {recommendationData.client}</h3>
                            <h4>Suitable Dishes:</h4>
                            <ul>
                                {recommendationData.suitable_dishes.map((dish, index) => (
                                    <li key={index}>{dish}</li>
                                ))}
                            </ul>
                            <h4>Recommendation:</h4>
                            <p>{recommendationData.recommendation}</p>
                        </div>
                    ) : (
                        <p>No recommendation data found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecommendationPopup;