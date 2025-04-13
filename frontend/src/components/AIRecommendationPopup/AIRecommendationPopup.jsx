// ForTest/frontend/src/components/AIRecommendationPopup/AIRecommendationPopup.jsx
import React from 'react';
import './AIRecommendationPopup.css';

const AIPopup = ({ onClose }) => {
  return (
    <div className="ai-popup">
      <div className="ai-popup-container">
        <div className="ai-popup-title">
          <h2>AI Recommended Dishes</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="ai-popup-content">
          {/* 這裡是推薦菜品的地方，目前留白 */}
        </div>
      </div>
    </div>
  );
};

export default AIPopup;