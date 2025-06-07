import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const {token, admin, setAdmin, setToken, username, userId, setUsername, setUserId } = useContext(StoreContext);
  const logout=()=>{
    sessionStorage.clear();
    setUsername("");
    setUserId("");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Restaruant Logo" />
      
      {token && admin ? (
        <p className="login-conditon"><label className="username">User: {username}  ID: {userId} </label>
        <button className="logoutButton" onClick={logout}>Logout</button></p>
      ) : (
        <p className="login-conditon" onClick={()=>navigate("/")}>Login</p>
      )}
      
    </div>
  );
};

export default Navbar;
