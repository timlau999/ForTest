// restaurant_b02/frontend/src/App.jsx
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { LoginPopup } from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Order from './components/Order/Order';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Chatbot from './components/Chatbot/Chatbot';
import UserAvatar from './components/UserAvatar/UserAvatar'; 
import StoreContextProvider from './context/StoreContext.jsx';
import Reservation from './pages/Reservation/Reservation';
import Foodwiki from './components/Foodwiki/Foodwiki.jsx';
import { ToastContainer } from "react-toastify";

const App = () => {
    // display popup for login
    const [showLogin, setShowLogin] = useState(false);
 const backendUrl = 'http://localhost:4000';
    //const backendUrl = 'http://smart.restaurant.vtcb02.tech';
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); 
    const customerId = localStorage.getItem('customerId');
    
    return (
        <StoreContextProvider backendUrl={backendUrl}>
            <ToastContainer />
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
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Order backendUrl={backendUrl} />} />
                    <Route path="/order-history" element={<OrderHistory backendUrl={backendUrl} />} />
                    <Route path="/reservation" element={<Reservation backendUrl={backendUrl}/>} />
                </Routes>
            </div>
            <Footer />
            <Chatbot />
            <Foodwiki />
        </StoreContextProvider>
    );
};

export default App;
