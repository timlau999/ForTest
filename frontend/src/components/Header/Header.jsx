// ForTest/frontend/src/components/Header/Header.jsx
import React, { useState } from 'react';
import './Header.css';
import AIRecommendationPopup from '../AIRecommendationPopup/AIRecommendationPopup'; 

const Header = ({ customerId }) => {
    const [isAIRecommendationPopupOpen, setIsAIRecommendationPopupOpen] = useState(false);

    const handleAIButtonClick = () => {
        setIsAIRecommendationPopupOpen(!isAIRecommendationPopupOpen);
    };

    return (
        <div className="header">
            <div className="header-contents">
                <h2>AI Recommended Dishes Just for You</h2>
                <p>Experience the convenience of an AI - generated menu. Based on your profile.</p>
                <button onClick={handleAIButtonClick}>AI recommendation</button>
            </div>
            {isAIRecommendationPopupOpen && <AIRecommendationPopup onClose={() => setIsAIRecommendationPopupOpen(false)} customerId={customerId} />}
        </div>
    );
};

export default Header;