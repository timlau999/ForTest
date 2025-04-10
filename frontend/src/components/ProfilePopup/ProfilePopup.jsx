// ForTest/frontend/src/components/ProfilePopup.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePopup.css';

const ProfilePopup = ({ isOpen, onClose, customerId }) => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchProfileData = async () => {
                try {
                    // 修改请求 URL 的端口为 4000
                    const response = await axios.get(`http://localhost:4000/api/user/profile/${customerId}`, {
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                    if (response.data.success) {
                        setProfileData(response.data.data);
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

    if (!isOpen) return null;

    return (
        <div className="profile-popup">
            <div className="profile-popup-container">
                <div className="profile-popup-title">
                    <h2>User Profile</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : profileData ? (
                    <div className="profile-popup-content">
                        <p>Height: {profileData.height}</p>
                        <p>Weight: {profileData.weight}</p>
                        <p>Allergy: {profileData.allergy}</p>
                        <p>Medical Conditions: {profileData.medicalConditions}</p>
                        <p>Dietary Preference: {profileData.dietaryPreference}</p>
                    </div>
                ) : (
                    <p>No profile data found.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePopup;