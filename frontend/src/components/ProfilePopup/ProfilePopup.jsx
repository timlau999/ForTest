import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePopup.css';

const ALLERGY_OPTIONS = [
  'No Allergy', 'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 
  'Wheat', 'Soy', 'Gluten', 'Sesame', 'Milk', 'Pollen', 'Latex'
];

const MEDICAL_CONDITIONS_OPTIONS = [
  'No Medical issue', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Allergies', 
  'Arthritis', 'Depression', 'Anxiety', 'High Cholesterol', 'Thyroid Issues',
  'Celiac Disease', 'Crohn’s Disease', 'Ulcerative Colitis'
];

const DIETARY_PREFERENCE_OPTIONS = [
  'No Dietary Preference', 'Vegetarian', 'Vegan', 'Pescetarian', 'Gluten-Free', 'Dairy-Free', 
  'Kosher', 'Halal', 'Paleo', 'Ketogenic', 'Low Carb', 'High Protein',
  'Mediterranean', 'Flexitarian'
];

const ProfilePopup = ({ isOpen, onClose, customerId, backendUrl }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    if (isOpen) {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/user/profile/${customerId}`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          if (response.data.success) {
            const parsedData = {
              ...response.data.data,
              allergy: response.data.data.allergy ? response.data.data.allergy.split(',') : [],
              medicalConditions: response.data.data.medicalConditions ? response.data.data.medicalConditions.split(',') : [],
              dietaryPreference: response.data.data.dietaryPreference ? response.data.data.dietaryPreference.split(',') : []
            };
            setProfileData(parsedData);
            setEditedData({...parsedData});
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
  }, [isOpen, customerId, backendUrl]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const dataToSave = {
        ...editedData,
        allergy: editedData.allergy?.join(','),
        medicalConditions: editedData.medicalConditions?.join(','),
        dietaryPreference: editedData.dietaryPreference?.join(',')
      };
      
      const response = await axios.put(`${backendUrl}/api/user/profile/${customerId}`, dataToSave);
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

  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const toggleOption = (field, option) => {
    setEditedData(prevData => {
      const currentValues = [...(prevData[field] || [])];
      const index = currentValues.indexOf(option);
      
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option);
      }
      
      return {
        ...prevData,
        [field]: currentValues
      };
    });
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
                <div className="multi-select-dropdown">
                  <div 
                    className="dropdown-header"
                    onClick={() => toggleDropdown('allergy')}
                  >
                    {editedData.allergy?.length > 0 
                      ? editedData.allergy.join(', ') 
                      : 'Select allergies'}
                    <i className="fa fa-chevron-down"></i>
                  </div>
                  {dropdownOpen.allergy && (
                    <div className="dropdown-options">
                      {ALLERGY_OPTIONS.map(option => (
                        <div 
                          key={option} 
                          className="option"
                          onClick={() => toggleOption('allergy', option)}
                        >
                          <input
                            type="checkbox"
                            checked={editedData.allergy?.includes(option)}
                            readOnly
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span>{profileData.allergy?.join(', ') || 'None'}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Medical Conditions:</label>
              {isEditing ? (
                <div className="multi-select-dropdown">
                  <div 
                    className="dropdown-header"
                    onClick={() => toggleDropdown('medicalConditions')}
                  >
                    {editedData.medicalConditions?.length > 0 
                      ? editedData.medicalConditions.join(', ') 
                      : 'Select conditions'}
                    <i className="fa fa-chevron-down"></i>
                  </div>
                  {dropdownOpen.medicalConditions && (
                    <div className="dropdown-options">
                      {MEDICAL_CONDITIONS_OPTIONS.map(option => (
                        <div 
                          key={option} 
                          className="option"
                          onClick={() => toggleOption('medicalConditions', option)}
                        >
                          <input
                            type="checkbox"
                            checked={editedData.medicalConditions?.includes(option)}
                            readOnly
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span>{profileData.medicalConditions?.join(', ') || 'None'}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Dietary Preference:</label>
              {isEditing ? (
                <div className="multi-select-dropdown">
                  <div 
                    className="dropdown-header"
                    onClick={() => toggleDropdown('dietaryPreference')}
                  >
                    {editedData.dietaryPreference?.length > 0 
                      ? editedData.dietaryPreference.join(', ') 
                      : 'Select preferences'}
                    <i className="fa fa-chevron-down"></i>
                  </div>
                  {dropdownOpen.dietaryPreference && (
                    <div className="dropdown-options">
                      {DIETARY_PREFERENCE_OPTIONS.map(option => (
                        <div 
                          key={option} 
                          className="option"
                          onClick={() => toggleOption('dietaryPreference', option)}
                        >
                          <input
                            type="checkbox"
                            checked={editedData.dietaryPreference?.includes(option)}
                            readOnly
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span>{profileData.dietaryPreference?.join(', ') || 'None'}</span>
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
