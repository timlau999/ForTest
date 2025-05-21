import React from 'react';
import './AboutUsPopup.css';

const AboutUsPopup = ({ onClose }) => {
  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="about-close-button" 
          onClick={onClose}
          aria-label="Close about us popup"
        >
          ×
        </button>
        
        <h2 className="about-title">About Our Company</h2>
        
        <div className="about-content">
          <p className="about-description">
            Founded in 2020, We are a leading and innovative restaurant chain company, committed to providing quality food and services throughout Hong Kong
          </p>
          
          <ul className="about-features">
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              15+ Professional Chefs
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Serving all Hong Kong residents and tourists
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Possess professional hygiene accreditation
            </li>
          </ul>
          
          <div className="about-contact">
            <h3 className="contact-title">Contact Us</h3>
            <p className="contact-info">
              <strong>Email:</strong> kcheung@vtc.edu.hk
            </p>
            <p className="contact-info">
              <strong>Phone:</strong> +852 3928 2660
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;