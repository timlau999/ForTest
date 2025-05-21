import React, { useEffect, useState } from "react";
import "./Account.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Account = ({ url }) => {
    const navigate = useNavigate();
    const { token,admin } = useContext(StoreContext);
    const [account, setAccount] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchAccount = async () => {
        const response = await axios.get(`${url}/api/user/getaccount`);
        if (response.data.success) {
          setAccount(response.data.data);
        } else {
          toast.error("Error");
        }
      };

    useEffect(() => {
        if (!admin && !token) {
          toast.error("Please Login First");
          navigate("/");
        }
        fetchAccount();
      }, []);
  return (
    <div className="Account-list">
      <h3>All Customer Account</h3>
      <label >Search account: </label>
      <input type="text" placeholder="ID/Phone.no" />
      <img src={assets.search} alt="search" className="search-icon"/>

      <div className="Account-table">
        {account.map((item) => {
          return (
            <div className="Account-container" key={item.userId}>
              <p>Username: {item.username}</p>
              <p>Email: {item.email}</p>
              <p>Address: {item.address}</p>
              <p>Phone Number: {item.phoneNumber}</p>
              <p className="Account-Button-List">
              <button className="Account-Button"><img className="account-pencil" src={assets.pencil}/> Edit</button>
              <button className="Account-Button">Activate</button>
              <button className="Account-Button">Inactivate</button>
              <button className="Account-Button">Delete</button>
              </p>
            </div>
          );
        }
    )
    }
    </div>
    </div>
  );
}
  export default Account;