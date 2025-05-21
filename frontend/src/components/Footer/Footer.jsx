import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './Footer.css';
import MapModal from '../Map/Map'; 
import AboutUsPopup from '../AboutUsPopup/AboutUsPopup';

const Footer = () => {
  const [showMap, setShowMap] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滾動
    });
  };

  return (
    <div className='footer'>
      <div className="footer-container" id="footer">
        <div className="footer-content">
          <div className="footer-content-left">
            <img className="footer-logo" src={assets.logo} alt="" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti dicta eum numquam? Maxime beatae numquam ab ipsam, cumque natus nulla corporis fugiat, animi, aut cum! Dolores libero odit culpa eligendi!</p>
            <div className="footer-social-icon">
              <img src={assets.facebook_icon} alt="" />
              <img src={assets.twitter_icon} alt="" />
              <img src={assets.linkedin_icon} alt="" />
            </div>  
          </div>
          
          <div className="footer-content-right">
            <h2>COMPANY</h2>
            <ul>
             <li 
                onClick={scrollToTop} // 修改：綁定滾動函數
                style={{ cursor: 'pointer' }}
                className="home-link"
              >
                Home
              </li>
                
               <li 
                onClick={() => setShowAbout(true)}
                style={{ cursor: 'pointer' }}
                className="address-link"
              >About Us</li>
              <li 
                onClick={() => setShowMap(true)}
                style={{ cursor: 'pointer' }}
                className="address-link"
              >
                Address
              </li>
            </ul>
          </div>
          
          <div className="footer-content-center">
            <h2>GET IN TOUCH</h2>
            <ul>
              <li>+852 3928 2660</li>
              <li>kcheung@vtc.edu.hk</li>
            </ul>
          </div>
        </div>
        <hr />
      </div>

      {/* 地圖模態框 */}
      {showMap && (
        <div className="map-modal-overlay" onClick={() => setShowMap(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="map-close-button"
              onClick={() => setShowMap(false)}
            >
              ×
            </button>
            <MapModal onClose={() => setShowMap(false)} />
          </div>
        </div>
      )}

      
      {showAbout && <AboutUsPopup onClose={() => setShowAbout(false)} />}

    </div>
  );
};

export default Footer;