// ForTest/frontend/src/components/Navbar/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Navbar.css';
import { HashLink } from 'react-router-hash-link';


const Navbar = ({ setShowLogin, isLoggedIn, setIsLoggedIn, UserAvatar, backendUrl }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const onClickMB = () => {setIsOpen(!isOpen);}

    const menubar = (cn) => {
        return (
            <ul className={cn}>
                <p><HashLink to="/#header" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</HashLink></p>
                <p><HashLink to="/reservation" onClick={() => setMenu("reservation")} className={menu === "reservation" ? "active" : ""}>Reservation</HashLink></p>
                <p><HashLink to="/#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</HashLink></p>
                <p><HashLink to="/#order" onClick={() => setMenu("order")} className={menu === "order" ? "active" : ""}>order</HashLink></p>
                <p><HashLink to="/#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</HashLink></p>
            </ul>
        );
    }

    return (
        <div className="navbar">
            <Link to="/" ><img src={assets.logo} alt="" className="log" /></Link>
            
            {menubar("navbar-menu")}

            <img className="navbar-menu-logo-img" src={assets.menu_burger} onClick={onClickMB}></img>
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
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
