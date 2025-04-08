import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import axios from 'axios';

export const LoginPopup = ({ setShowLogin, backendUrl }) => {
    console.log('Backend URL:', backendUrl);
    const [currState, setCurrState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // 新增 name 状态

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeName = (e) => {
        setName(e.target.value);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        console.log('Sending login request...'); // 添加日志输出
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, {
                email: email,
                password: password
            });
            console.log('Login response:', response); // 打印响应信息
            if (response.data.success) {
               localStorage.setItem('token', response.data.token);
               console.log('Login successful');
               setShowLogin(false);
            } else {
                console.log('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response) {
               console.log('Response data:', error.response.data);
               console.log('Response status:', error.response.status);
               console.log('Response headers:', error.response.headers);
          } else if (error.request) {
               console.log('No response received:', error.request);
          } else {
               console.log('Error setting up the request:', error.message);
          }
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, {
                username: username,
                password: password,
                email: email,
                address: "",
                phoneNumber: "",
                name: name,
                permissionId: 1 // 假设默认权限 ID 为 1
            });
            if (response.data.success) {
                console.log('Registration successful');
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
                    {currState === "Login" ? <></> : <input type="text" placeholder='Your name' value={name} onChange={onChangeName} required />}
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
