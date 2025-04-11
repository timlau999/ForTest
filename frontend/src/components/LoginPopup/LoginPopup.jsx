// ForTest/frontend/src/components/LoginPopup/LoginPopup.jsx
import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginPopup = ({ setShowLogin, backendUrl, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [currState, setCurrState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [allergy, setAllergy] = useState("");
    const [medicalConditions, setMedicalConditions] = useState("");
    const [dietaryPreference, setDietaryPreference] = useState("");

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const onChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const onChangePhoneNumber = (e) => {
        setPhoneNumber(e.target.value);
    };

    const onChangeHeight = (e) => {
        setHeight(e.target.value);
    };

    const onChangeWeight = (e) => {
        setWeight(e.target.value);
    };

    const onChangeAllergy = (e) => {
        setAllergy(e.target.value);
    };

    const onChangeMedicalConditions = (e) => {
        setMedicalConditions(e.target.value);
    };

    const onChangeDietaryPreference = (e) => {
        setDietaryPreference(e.target.value);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, {
                email: email,
                password: password
            });
            if (response.data.success) {
                // 登录成功，存储 token 和用户信息
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('userId', response.data.id);

                // 获取 customerId 并存储
                const userId = response.data.id;
                const customerResponse = await axios.get(`${backendUrl}/api/user/customer/${userId}`);
                if (customerResponse.data.success) {
                    localStorage.setItem('customerId', customerResponse.data.customerId);
                }

                console.log('Login successful');
                setShowLogin(false);
                // 更新登录状态
                setIsLoggedIn(true);
            } else {
                console.log('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, {
                username: username,
                password: password,
                email: email,
                address: address,
                phoneNumber: phoneNumber,
                permissionId: 1,
                height: height,
                weight: weight,
                allergy: allergy,
                medicalConditions: medicalConditions,
                dietaryPreference: dietaryPreference
            });
            if (response.data.success) {
                console.log('Registration successful');
                setShowLogin(false);
                setCurrState("Login");
            } else {
                console.log('Registration failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={currState === "Login" ? onLogin : onRegister} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <>
                            <h3>Register Details</h3>
                            <input
                                type="text"
                                placeholder='Username'
                                value={username}
                                onChange={onChangeUsername}
                                required
                            />
                            <input
                                type="email"
                                placeholder='Your email'
                                value={email}
                                onChange={onChangeEmail}
                                required
                            />
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={onChangePassword}
                                required
                            />
                            <input
                                type="text"
                                placeholder='Phone Number'
                                value={phoneNumber}
                                onChange={onChangePhoneNumber}
                                required
                            />
                            <input
                                type="text"
                                placeholder='Address'
                                value={address}
                                onChange={onChangeAddress}
                                required
                            />
                            <h3>Profile</h3>
                            <input
                                type="number"
                                placeholder='Height'
                                value={height}
                                onChange={onChangeHeight}
                            />
                            <input
                                type="number"
                                placeholder='Weight'
                                value={weight}
                                onChange={onChangeWeight}
                            />
                            <input
                                type="text"
                                placeholder='Allergy'
                                value={allergy}
                                onChange={onChangeAllergy}
                            />
                            <input
                                type="text"
                                placeholder='Medical Conditions'
                                value={medicalConditions}
                                onChange={onChangeMedicalConditions}
                            />
                            <input
                                type="text"
                                placeholder='Dietary Preference'
                                value={dietaryPreference}
                                onChange={onChangeDietaryPreference}
                            />
                        </>
                    )}
                    {currState === "Login" && (
                        <>
                            <input
                                type="email"
                                placeholder='Your email'
                                value={email}
                                onChange={onChangeEmail}
                                required
                            />
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={onChangePassword}
                                required
                            />
                        </>
                    )}
                </div>
                <button>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account ?<span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                ) : (
                    <p>Already have an account?<span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    );
};
