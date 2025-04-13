import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
        <div className="header-contents">
            <h2>Order AI - Recommended Dishes Just for You</h2>
            <p>Experience the convenience of an AI - generated menu. Based on your profile, we offer a selection of delicious dishes made with high - quality ingredients.</p>
            <button>AI recommendation</button>
        </div>
    </div>
  )
}

export default Header