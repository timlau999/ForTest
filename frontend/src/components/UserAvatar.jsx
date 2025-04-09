import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAvatar.css'; // 后续会创建这个 CSS 文件

const UserAvatar = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="user-avatar" onClick={toggleDropdown}>
            <span>{name}</span>
            <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                <p>{name}</p>
                <hr />
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        </div>
    );
};

export default UserAvatar;
