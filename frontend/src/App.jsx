// ForTest/frontend/src/App.jsx
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { LoginPopup } from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Order from './pages/PlaceOrder/Order';
import Chatbot from './components/Chatbot/Chatbot';
import UserAvatar from './components/UserAvatar/UserAvatar'; // 导入 UserAvatar 组件

const App = () => {
    // display popup for login
    const [showLogin, setShowLogin] = useState(false);
    const backendUrl = 'http://192.168.0.174:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // 检查用户是否登录

    return (
        <>
            {showLogin ? (
                <LoginPopup
                    setShowLogin={setShowLogin}
                    backendUrl={backendUrl}
                    setIsLoggedIn={setIsLoggedIn}
                />
            ) : (
                <></>
            )}
            <div className='app'>
                <Navbar
                    setShowLogin={setShowLogin}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    UserAvatar={UserAvatar} // 将 UserAvatar 组件传递给 Navbar
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Order />} />
                </Routes>
            </div>
            <Footer />
            <Chatbot />
        </>
    );
};

export default App;
