import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import { BsXCircle } from "react-icons/bs";
import { BsArrowClockwise } from "react-icons/bs";
import { BsCaretDown } from "react-icons/bs";
import axios from "axios";
import { BsPersonFill } from "react-icons/bs";

const Navbar = ({url}) => {
  const navigate=useNavigate();
  const {token, admin, setAdmin, staff, setStaff, setToken, username, userId, setUsername, setUserId } = useContext(StoreContext);
  const logout=()=>{
    sessionStorage.clear();
    setUsername("");
    setUserId("");
    setToken("");
    setAdmin(false);
    setStaff(false);
    toast.success("Logout Successfully")
    navigate("/");
  }
  const [isOpenAccount, setIsOpenAccount] = useState();

  const fetchUserInfoData = async () => {
                try {
                    const response = await axios.post(`${url}/api/user/getuserinfoA`, {userId});
                    if (response.data.success) {
                        setData(response.data.data);
                    } else {
                        console.error('Failed to get user info data:', response.data.message);
                    }
                } catch (error) {
                    console.error('Error fetching user info data:', error);
                }
            };

  const [openEditAc, setOpenEditAc] = useState(false);
    const [data, setData] = useState({
          username: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
        });

    const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("address", data.address);

    const response = await axios.post(`${url}/api/user/updateuserinfoA`, formData, {headers: {"Content-Type": "application/json"}});
    if (response.data.success) {
      setData({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
      });
      setOpenEditAc(!openEditAc);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Restaruant Logo" />
      
      {token && (admin || staff) ? (
        <div className="login-conditon">
          <div className="username" onClick={()=> {setOpenEditAc(!openEditAc);
            fetchUserInfoData();}}>
            <BsPersonFill /> {username}  ID: {userId} <BsCaretDown /></div>
          <button className="logoutButton" onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="login-conditon-login" onClick={()=>navigate("/")}>Login</div>
      )}

      {openEditAc? 
                          <div className="edit-menuitem-container">
                          <BsXCircle onClick={() => setOpenEditAc(!openEditAc)}/>
                            <BsArrowClockwise onClick={() => setData({
                                username: "",
                                email: "",
                                password: "",
                                phoneNumber: "",
                                address: "",
                                })}/>
                            <form onSubmit={onSubmitHandler} className="flex-col">
                              Edit Account
                          <div className="edit-product-name flex-col">
                            <p>Username</p>
                            <input
                              onChange={onChangeHandler}
                              value={data.username}
                              type="text"
                              name="username"
                              placeholder="Type here"
                              required
                            />
                          </div>
                          <div className="edit-product-name flex-col">
                            <p>Email</p>
                            <input
                              onChange={onChangeHandler}
                              value={data.email}
                              type="email"
                              name="email"
                              placeholder=""
                              required
                            />
                          </div>
                          <div className="edit-product-name flex-col">
                            <p>Password</p>
                            <input
                              onChange={onChangeHandler}
                              value={data.password}
                              type="password"
                              name="password"
                              placeholder="Type here"
                              required
                            />
                          </div>
                          <div className="edit-product-name flex-col">
                            <p>Phone Number</p>
                            <input
                              onChange={onChangeHandler}
                              value={data.phoneNumber}
                              type="tel"
                              name="phoneNumber"
                              placeholder="Type here"
                              pattern="[0-9]*"
                              inputMode="numeric"
                              required
                            />
                          </div>
                          <div className="edit-product-name flex-col">
                            <p>Address</p>
                            <input
                              onChange={onChangeHandler}
                              value={data.address}
                              type="text"
                              name="address"
                              placeholder="Type here"
                              required
                            />
                          </div>
                          <button type="submit" className="edit-btn">
                            Edit
                          </button>
                        </form>
                      </div>
                
                : null}
      
    </div>
  );
};

export default Navbar;
