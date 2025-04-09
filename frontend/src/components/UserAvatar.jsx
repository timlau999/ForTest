import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import './UserAvatar.css';

const UserAvatar = ({ onLogout }) => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="user-avatar" onClick={toggleMenu}>
            <span className="avatar">
                <img src={assets.user_icon} alt="User Avatar" />
            </span>
            {isMenuOpen && (
                <div className="avatar-menu">
                    <p>{name}</p>
                    <button onClick={handleLogout}>Sign Out</button>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;    
