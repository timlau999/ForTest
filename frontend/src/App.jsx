import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { LoginPopup } from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Order from './components/Order/Order';
import Chatbot from './components/Chatbot/Chatbot';
import UserAvatar from './components/UserAvatar/UserAvatar'; 
import StoreContextProvider from './context/StoreContext.jsx';

const App = () => {
    // display popup for login
    const [showLogin, setShowLogin] = useState(false);
    const backendUrl = 'http://localhost:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); 
    const customerId = localStorage.getItem('customerId'); 
    return (
        <StoreContextProvider backendUrl={backendUrl}>
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
                    UserAvatar={UserAvatar} 
                    backendUrl={backendUrl} 
                />
                <Routes>
                    <Route path="/" element={<Home backendUrl={backendUrl} />} />
                    <Route path="/cart" element={<Cart backendUrl={backendUrl} />} />
                    <Route path="/order" element={<Order backendUrl={backendUrl} />} />
                </Routes>
            </div>
            <Footer />
            <Chatbot />
        </StoreContextProvider>
    );
};

export default App;