// ForTest/frontend/src/components/UserAvatar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAvatar.css'; 
import ProfilePopup from '../ProfilePopup/ProfilePopup';

const UserAvatar = ({ onLogout }) => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        navigate('/');
        if (onLogout) {
            onLogout();
        }
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        setIsProfilePopupOpen(true);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeProfilePopup = () => {
        setIsProfilePopupOpen(false);
    };

    return (
        <div className="user-avatar" onClick={toggleDropdown}>
            <span>{name}</span>
            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                <p>{name}</p>
                <hr />
                <button onClick={handleProfileClick}>Profile</button>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
            <ProfilePopup
                isOpen={isProfilePopupOpen}
                onClose={closeProfilePopup}
                userId={userId}
            />
        </div>
    );
};

export default UserAvatar;
