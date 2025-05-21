import React from 'react';
import './Map.css';

const Map = ({ onClose }) => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1845.6321089232886!2d114.25316915055073!3d22.305845058269753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340403ee2d8d0e73%3A0xdf7b9ca941b4364f!2z6aaZ5riv5bCI5qWt5pWZ6IKy5a246Zmi77yI5p2O5oOg5Yip77yJ!5e0!3m2!1szh-TW!2shk!4v1667741262272!5m2!1szh-TW!2shk";

  return (
    <div className="map-modal">
      <div className="map-container">
        <iframe 
          src={mapUrl}
          title="Location Map"
          allowFullScreen
          loading="lazy"
          className="fullsize-map" 
        />
      </div>
      <br></br>
      <div className="address-card">
        <h2>Our Location</h2>
        <div className="address-text">
          <p>3 King Ling Road, Tseung Kwan O, N.T.</p>
          
          <p>Hong Kong</p>
        </div>
      </div>
    </div>
  );
};

export default Map;