// restaurant_b02/frontend/src/components/Header/Header.jsx
import React, { useState } from 'react';
import './Header.css';
import AIRecommendationPopup from '../AIRecommendationPopup/AIRecommendationPopup'; 

const Header = ({ backendUrl }) => {
    const [isAIRecommendationPopupOpen, setIsAIRecommendationPopupOpen] = useState(false);
    const customerId = localStorage.getItem('customerId');

    const handleAIButtonClick = () => {
        setIsAIRecommendationPopupOpen(!isAIRecommendationPopupOpen);
    };

    return (
        <div className="header" id="header">
            <div className="header-contents">
                <h3>AI Recommended Dishes Just for You</h3>
                <p>Experience the convenience of an AI - generated menu. Based on your profile.</p>
                <button onClick={handleAIButtonClick}>AI recommendation</button>
            </div>
            {isAIRecommendationPopupOpen && <AIRecommendationPopup onClose={() => setIsAIRecommendationPopupOpen(false)} customerId={customerId} backendUrl={backendUrl} />}
        </div>
    );
};

export default Header;
