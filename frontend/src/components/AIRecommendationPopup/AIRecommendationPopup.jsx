// ForTest/frontend/src/components/AIRecommendationPopup/AIRecommendationPopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AIRecommendationPopup.css';

const AIRecommendationPopup = ({ onClose }) => {
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

export default AIRecommendationPopup;