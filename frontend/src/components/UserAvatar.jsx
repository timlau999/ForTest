import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserAvatar = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/');
    };

    return (
        <div>
            <span>{name}</span>
            <button onClick={handleLogout}>Sign Out</button>
        </div>
    );
};

export default UserAvatar;
