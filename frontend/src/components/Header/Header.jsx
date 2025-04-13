// ForTest/frontend/src/components/Header/Header.jsx
import React, { useState } from 'react';
import './Header.css';
import AIPopup from '../AIRecommendationPopup/AIRecommendationPopup'; 

const Header = () => {
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);

  const handleAIButtonClick = () => {
    setIsAIPopupOpen(!isAIPopupOpen);
  };

  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order AI - Recommended Dishes Just for You</h2>
        <p>Experience the convenience of an AI - generated menu. Based on your profile, we offer a selection of delicious dishes made with high - quality ingredients.</p>
        <button onClick={handleAIButtonClick}>AI recommendation</button>
      </div>
      {isAIPopupOpen && <AIPopup onClose={() => setIsAIPopupOpen(false)} />}
    </div>
  );
};

export default Header;