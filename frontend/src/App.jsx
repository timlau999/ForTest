import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { LoginPopup } from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Order from './pages/PlaceOrder/Order';
import Chatbot from './components/Chatbot/Chatbot';

const App = () => {
    // display popup for login
    const [showLogin, setShowLogin] = useState(false);
    const backendUrl = 'http://192.168.0.174:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token')!== null);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
    };

    return (
        <>
            {showLogin && <LoginPopup setShowLogin={setShowLogin} backendUrl={backendUrl} onLogin={handleLogin} />}
            <div className='app'>
                <Navbar
                    setShowLogin={setShowLogin}
                    isLoggedIn={isLoggedIn}
                    onLogout={handleLogout}
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
