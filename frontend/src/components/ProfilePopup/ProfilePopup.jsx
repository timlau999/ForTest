// ForTest/frontend/src/components/ProfilePopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePopup.css';

const ProfilePopup = ({ isOpen, onClose, customerId }) => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        if (isOpen) {
            const fetchProfileData = async () => {
                try {
                    const response = await axios.get(`http://192.168.0.174:4000/api/user/profile/${customerId}`, {
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                    if (response.data.success) {
                        setProfileData(response.data.data);
                        setEditedData(response.data.data);
                    } else {
                        console.error('Failed to get profile data:', response.data.message);
                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    setIsLoading(false);
                }
            };

            fetchProfileData();
        }
    }, [isOpen, customerId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`http://192.168.0.174:4000/api/user/profile/${customerId}`, editedData);
            if (response.data.success) {
                setProfileData(editedData);
                setIsEditing(false);
            } else {
                console.error('Failed to save profile data:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving profile data:', error);
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
        <div className="profile-popup">
            <div className="profile-popup-container">
                <div className="profile-popup-title">
                    <h2>User Profile</h2>
                    {isEditing ? (
                        <button onClick={handleSaveClick}>Save</button>
                    ) : (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                    <button onClick={onClose}>Close</button>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : profileData ? (
                    <div className="profile-popup-content">
                        <div className="profile-field">
                            <label>Height:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="height"
                                    value={editedData.height || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profileData.height}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Weight:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="weight"
                                    value={editedData.weight || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profileData.weight}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Allergy:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="allergy"
                                    value={editedData.allergy || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profileData.allergy}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Medical Conditions:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="medicalConditions"
                                    value={editedData.medicalConditions || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profileData.medicalConditions}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Dietary Preference:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="dietaryPreference"
                                    value={editedData.dietaryPreference || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profileData.dietaryPreference}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No profile data found.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePopup;
