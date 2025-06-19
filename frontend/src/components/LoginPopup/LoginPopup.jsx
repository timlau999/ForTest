import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export const LoginPopup = ({ setShowLogin, backendUrl, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [allergy, setAllergy] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState([]);
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({
    allergy: false,
    medicalConditions: false,
    dietaryPreference: false
  });
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [medicalConditionOptions, setMedicalConditionOptions] = useState([]);
  const [dietaryPreferenceOptions, setDietaryPreferenceOptions] = useState([]);
  const [isLoadingAllergyOptions, setIsLoadingAllergyOptions] = useState(true);
  const [isLoadingMedicalConditionOptions, setIsLoadingMedicalConditionOptions] = useState(true);
  const [isLoadingDietaryPreferenceOptions, setIsLoadingDietaryPreferenceOptions] = useState(true);

  useEffect(() => {
    const fetchAllergyOptions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/options/ingredients`);
        const ingredients = response.data.data;
        const options = ingredients.map(ingredient => ingredient.name);
        setAllergyOptions(options);
      } catch (error) {
        console.error('Error fetching allergy options:', error);
      } finally {
        setIsLoadingAllergyOptions(false);
      }
    };

    const fetchMedicalConditionOptions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/options/medical-conditions`);
        const conditions = response.data.data;
        const options = conditions.map(condition => condition.name);
        setMedicalConditionOptions(options);
      } catch (error) {
        console.error('Error fetching medical condition options:', error);
      } finally {
        setIsLoadingMedicalConditionOptions(false);
      }
    };

    const fetchDietaryPreferenceOptions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/options/dietary-preferences`);
        const preferences = response.data.data;
        const options = preferences.map(preference => preference.name);
        setDietaryPreferenceOptions(options);
      } catch (error) {
        console.error('Error fetching dietary preference options:', error);
      } finally {
        setIsLoadingDietaryPreferenceOptions(false);
      }
    };

    fetchAllergyOptions();
    fetchMedicalConditionOptions();
    fetchDietaryPreferenceOptions();
  }, [backendUrl]);

  const validateLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: "" });
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    if (errors.username) setErrors({ ...errors, username: "" });
  };

  const onChangeAddress = (e) => {
    setAddress(e.target.value);
    if (errors.address) setErrors({ ...errors, address: "" });
  };

  const onChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
  };

  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const toggleOption = (field, option) => {
    if (field === 'allergy') {
      setAllergy(prev => {
        const newAllergy = [...prev];
        const index = newAllergy.indexOf(option);
        index > -1 ? newAllergy.splice(index, 1) : newAllergy.push(option);
        return newAllergy;
      });
    } else if (field === 'medicalConditions') {
      setMedicalConditions(prev => {
        const newConditions = [...prev];
        const index = newConditions.indexOf(option);
        index > -1 ? newConditions.splice(index, 1) : newConditions.push(option);
        return newConditions;
      });
    } else if (field === 'dietaryPreference') {
      setDietaryPreference(prev => {
        const newPreference = [...prev];
        const index = newPreference.indexOf(option);
        index > -1 ? newPreference.splice(index, 1) : newPreference.push(option);
        return newPreference;
      });
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email: email,
        password: password
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userId', response.data.id);
        const userId = response.data.id;
        const customerResponse = await axios.get(`${backendUrl}/api/user/customer/${userId}`);
        if (customerResponse.data.success) {
          localStorage.setItem('customerId', customerResponse.data.customerId);
        }
        console.log('Login successful');
        toast.success("Login Successfully");
        setShowLogin(false);
        setIsLoggedIn(true);
      } else {
        console.log('Login failed:', response.data.message);
        setErrors({ ...errors, general: response.data.message });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({ ...errors, general: "Server error. Please try again later." });
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        username: username,
        password: password,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        permissionId: 1,
        allergy: allergy.join(','),
        medicalConditions: medicalConditions.join(','),
        dietaryPreference: dietaryPreference.join(',')
      });
      if (response.data.success) {
        console.log('Registration successful');
        setShowLogin(false);
        setCurrState("Login");
      } else {
        console.log('Registration failed:', response.data.message);
        setErrors({ ...errors, general: response.data.message });
      }
    } catch (error) {
      console.error('Error registering:', error);
      setErrors({ ...errors, general: "Server error. Please try again later." });
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={currState === "Login" ? onLogin : onRegister} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <>
              <h3 className="section-title">Register Details</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={onChangeUsername}
                    required
                  />
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={onChangeEmail}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChangePassword}
                    required
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={onChangePhoneNumber}
                    required
                  />
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                </div>

                <div className="input-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={onChangeAddress}
                    required
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
              </div>

              <h3 className="section-title">Profile</h3>
              <div className="input-grid">
                <div className="input-group">
                  <label>Allergy:</label>
                  <div className="multi-select-dropdown">
                    <div
                      className="dropdown-header"
                      onClick={() => toggleDropdown('allergy')}
                    >
                      {allergy.length > 0
                        ? allergy.join(', ')
                        : 'Select allergies'}
                      <i className="fa fa-chevron-down"></i>
                    </div>
                    {dropdownOpen.allergy && (
                      <div className="dropdown-options">
                        {isLoadingAllergyOptions ? (
                          <p>Loading allergy options...</p>
                        ) : (
                          allergyOptions.map(option => (
                            <div
                              key={option}
                              className="option"
                              onClick={() => {
                                toggleOption('allergy', option);
                                toggleDropdown('allergy');
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={allergy.includes(option)}
                                readOnly
                              />
                              <span>{option}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label>Medical Conditions:</label>
                  <div className="multi-select-dropdown">
                    <div
                      className="dropdown-header"
                      onClick={() => toggleDropdown('medicalConditions')}
                    >
                      {medicalConditions.length > 0
                        ? medicalConditions.join(', ')
                        : 'Select conditions'}
                      <i className="fa fa-chevron-down"></i>
                    </div>
                    {dropdownOpen.medicalConditions && (
                      <div className="dropdown-options">
                        {isLoadingMedicalConditionOptions ? (
                          <p>Loading medical condition options...</p>
                        ) : (
                          medicalConditionOptions.map(option => (
                            <div
                              key={option}
                              className="option"
                              onClick={() => {
                                toggleOption('medicalConditions', option);
                                toggleDropdown('medicalConditions');
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={medicalConditions.includes(option)}
                                readOnly
                              />
                              <span>{option}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Dietary Preference:</label>
                  <div className="multi-select-dropdown">
                    <div
                      className="dropdown-header"
                      onClick={() => toggleDropdown('dietaryPreference')}
                    >
                      {dietaryPreference.length > 0
                        ? dietaryPreference.join(', ')
                        : 'Select preferences'}
                      <i className="fa fa-chevron-down"></i>
                    </div>
                    {dropdownOpen.dietaryPreference && (
                      <div className="dropdown-options">
                        {isLoadingDietaryPreferenceOptions ? (
                          <p>Loading dietary preference options...</p>
                        ) : (
                          dietaryPreferenceOptions.map(option => (
                            <div
                              key={option}
                              className="option"
                              onClick={() => {
                                toggleOption('dietaryPreference', option);
                                toggleDropdown('dietaryPreference');
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={dietaryPreference.includes(option)}
                                readOnly
                              />
                              <span>{option}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {currState === "Login" && (
            <div className="input-grid">
              <div className="input-group full-width">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={onChangeEmail}
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group full-width">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={onChangePassword}
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
          )}
        </div>

        <button className="submit-button">{currState === "Sign Up" ? "Create account" : "Login"}</button>

        <div className="toggle-text">
          {currState === "Login" ? (
            <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
          )}
        </div>
      </form>
    </div>
  );
};