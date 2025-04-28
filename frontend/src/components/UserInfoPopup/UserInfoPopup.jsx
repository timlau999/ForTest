// ForTest/frontend/src/components/UserInfoPopup/UserInfoPopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfoPopup.css';

const UserInfoPopup = ({ isOpen, onClose, customerId }) => {
    const [userInfoData, setUserInfoData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        if (isOpen) {
            const fetchUserInfoData = async () => {
                try {
                    const response = await axios.get(`http://192.168.0.174:4000/api/user/userinfo/${customerId}`, {
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                    if (response.data.success) {
                        setUserInfoData(response.data.data);
                        setEditedData(response.data.data);
                    } else {
                        console.error('Failed to get user info data:', response.data.message);
                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching user info data:', error);
                    setIsLoading(false);
                }
            };

            fetchUserInfoData();
        }
    }, [isOpen, customerId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`http://192.168.0.174:4000/api/user/userinfo/${customerId}`, editedData);
            if (response.data.success) {
                setUserInfoData(editedData);
                setIsEditing(false);
            } else {
                console.error('Failed to save user info data:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving user info data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="user-info-popup">
            <div className="user-info-popup-container">
                <div className="user-info-popup-title">
                    <h2>User Information</h2>
                    {isEditing ? (
                        <button onClick={handleSaveClick}>Save</button>
                    ) : (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                    <button onClick={onClose}>Close</button>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : userInfoData ? (
                    <div className="user-info-popup-content">
                        <div className="user-info-field">
                            <label>Customer ID:</label>
                            <span>{userInfoData.customerId}</span>
                        </div>
                        <div className="user-info-field">
                            <label>Username:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={editedData.username || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{userInfoData.username}</span>
                            )}
                        </div>
                        <div className="user-info-field">
                            <label>Password:</label>
                            {isEditing ? (
                                <input
                                    type="password"
                                    name="password"
                                    value={editedData.password || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{userInfoData.password}</span>
                            )}
                        </div>
                        <div className="user-info-field">
                            <label>Email:</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editedData.email || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{userInfoData.email}</span>
                            )}
                        </div>
                        <div className="user-info-field">
                            <label>Address:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={editedData.address || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{userInfoData.address}</span>
                            )}
                        </div>
                        <div className="user-info-field">
                            <label>Phone Number:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={editedData.phoneNumber || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{userInfoData.phoneNumber}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No user info data found.</p>
                )}
            </div>
        </div>
    );
};

export default UserInfoPopup;
