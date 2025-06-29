// restaurant_b02/frontend/src/components/UserAvatar/UserAvatar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAvatar.css'; 
import ProfilePopup from '../ProfilePopup/ProfilePopup';
import UserInfoPopup from '../UserInfoPopup/UserInfoPopup'; 
import { toast } from "react-toastify";

const UserAvatar = ({ onLogout, backendUrl }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const customerId = localStorage.getItem('customerId');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
    const [isUserInfoPopupOpen, setIsUserInfoPopupOpen] = useState(false); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('customerId');
        toast.success("Log out Successfully");
        navigate('/');
        if (onLogout) {
            onLogout();
        }
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        setIsProfilePopupOpen(true);
    };

    const handleUserInfoClick = () => {
        setIsDropdownOpen(false);
        setIsUserInfoPopupOpen(true); 
    };

    const handlePointsClick = () => {
    
    };

    const handleOrderHistoryClick = () => {
        setIsDropdownOpen(false);
        navigate('/order-history');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeProfilePopup = () => {
        setIsProfilePopupOpen(false);
    };

    const closeUserInfoPopup = () => {
        setIsUserInfoPopupOpen(false); 
    };

    return (
        <div className="user-avatar" onClick={toggleDropdown}>
            <span className='usernameEmoji'>{username}</span>
            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                <button onClick={handleUserInfoClick}>{username}</button> 
                <hr />
                <button onClick={handleProfileClick}>Profile</button>
                <button onClick={handlePointsClick}>Points</button>
                <button onClick={handleOrderHistoryClick}>Order History</button>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
            <ProfilePopup
                isOpen={isProfilePopupOpen}
                onClose={closeProfilePopup}
                customerId={customerId}
                backendUrl={backendUrl} 
            />
            <UserInfoPopup
                isOpen={isUserInfoPopupOpen}
                onClose={closeUserInfoPopup}
                customerId={customerId}
                backendUrl={backendUrl} 
            /> 
        </div>
    );
};

export default UserAvatar;