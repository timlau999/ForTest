// ForTest/frontend/src/components/Navbar/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Navbar.css';

const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn, UserAvatar, backendUrl }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount } = useContext(StoreContext);

    return (
        <div className='navbar'>
            <Link to='/' ><img src={assets.logo} alt="" className="log" /></Link>
            <ul className="navbar-menu">
                <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <Link to="/reservation" onClick={() => setMenu("reservation")} className={menu === "reservation" ? "active" : ""}>Reservation</Link>
                <a href="/#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href="/#order" onClick={() => setMenu("order")} className={menu === "order" ? "active" : ""}>order</a>
                <a href="/#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {isLoggedIn ? (
                    <UserAvatar 
                        onLogout={() => setIsLoggedIn(false)} 
                        backendUrl={backendUrl} 
                    />
                ) : (
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
