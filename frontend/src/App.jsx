import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import { LoginPopup } from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Order from './pages/PlaceOrder/Order';
import Chatbot from './components/Chatbot/Chatbot'; // 引入 Chatbot 组件

const App = () => {
    //display popup for login
    const [showLogin, setShowLogin] = useState(false);
    const backendUrl = 'http://192.168.0.174:4000'; 
    return (
        <>
            {showLogin ? <LoginPopup setShowLogin={setShowLogin} backendUrl={backendUrl} /> : <></>}
            <div className='app'>
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Order />} />
                </Routes>
            </div>
            <Footer />
            <Chatbot /> {/* 添加 Chatbot 组件 */}
        </>
    );
};

export default App;
