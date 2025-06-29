// restaurant_b02/frontend/src/components/Navbar/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Navbar.css';
import { HashLink } from 'react-router-hash-link';
import { RiMenu4Line } from "react-icons/ri";

const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn, UserAvatar, backendUrl }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);

    const menubar = (cn) => {
        return (
            <ul className={cn}>
                <p><HashLink to="/#header" onClick={() => {setMenu("home");setIsOpen(!isOpen);}} className={menu === "home" ? "active" : ""}>home</HashLink></p>
                <p><HashLink to="/reservation" onClick={() => {setMenu("reservation");setIsOpen(!isOpen);}} className={menu === "reservation" ? "active" : ""}>Reservation</HashLink></p>
                <p><HashLink to="/#explore-menu" onClick={() => {setMenu("menu");setIsOpen(!isOpen);}} className={menu === "menu" ? "active" : ""}>menu</HashLink></p>
                <p><HashLink to="/#order" onClick={() => {setMenu("order");setIsOpen(!isOpen);}} className={menu === "order" ? "active" : ""}>order</HashLink></p>
                <p><HashLink to="/#footer" onClick={() => {setMenu("contact-us");setIsOpen(!isOpen);}} className={menu === "contact-us" ? "active" : ""}>contact us</HashLink></p>
            </ul>
        );
    }

    return (
        <div className="navbar">
            <Link to="/" ><img src={assets.logo} alt="" className="log" /></Link>
            
            <ul className="navbar-menu">
                <p><HashLink to="/#header" onClick={() => {setMenu("home");}} className={menu === "home" ? "active" : ""}>home</HashLink></p>
                <p><HashLink to="/reservation" onClick={() => {setMenu("reservation");}} className={menu === "reservation" ? "active" : ""}>Reservation</HashLink></p>
                <p><HashLink to="/#explore-menu" onClick={() => {setMenu("menu");}} className={menu === "menu" ? "active" : ""}>menu</HashLink></p>
                <p><HashLink to="/#order" onClick={() => {setMenu("order");}} className={menu === "order" ? "active" : ""}>order</HashLink></p>
                <p><HashLink to="/#footer" onClick={() => {setMenu("contact-us");}} className={menu === "contact-us" ? "active" : ""}>contact us</HashLink></p>
            </ul>

            <RiMenu4Line className="navbar-menu-logo-img" onClick={() => setIsOpen(!isOpen)}/>
            <div className={`showmenubar ${isOpen ? 'show' : ''}`}>{menubar()}</div>

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
                    
                        <button className='signInButton' onClick={() => setShowLogin(true)}>Login</button>
                    
                )}
            </div>
        </div>
    );
};

export default Navbar;
