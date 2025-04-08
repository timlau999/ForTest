import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './LoginPopup.css';
import axios from 'axios';

export const LoginPopup = ({ setShowLogin, backendUrl }) => {
    const [currState, setCurrState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, {
                username: email, // 假设使用 email 作为用户名
                password: password
            });
            if (response.data.success) {
                // 登录成功，存储 token 等操作
                localStorage.setItem('token', response.data.token);
                console.log('Login successful');
                setShowLogin(false);
            } else {
                console.log('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input type="text" placeholder='Your name' required />}
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
