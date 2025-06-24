import React, { useContext, useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import {useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate=useNavigate();
  const {admin,setAdmin, staff, setStaff, token, setToken,username,setUsername,userID,setUserId} = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post(url + "/api/user/login", data);
    if (response.data.success) {
      if (response.data.role === "admin" || response.data.role === "staff" ) {
        setToken(response.data.token);
        setUsername(response.data.username);
        setUserId(response.data.id);
        sessionStorage.setItem("token", response.data.token);
        if(response.data.role === "admin"){sessionStorage.setItem("admin", true);setAdmin(true);};
        if(response.data.role === "staff"){sessionStorage.setItem("staff", true);setStaff(true);};
        sessionStorage.setItem("username", response.data.username);
        sessionStorage.setItem("userId", response.data.id);
        toast.success("Login Successfully");
        navigate("/add")
      }else{
        toast.error("You are not an admin");
      }
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(()=>{
    if(sessionStorage.getItem("admin") && sessionStorage.getItem("token")){
       navigate("/orders");
    }
  },[])
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
