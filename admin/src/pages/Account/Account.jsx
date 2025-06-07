import React, { useEffect, useState } from "react";
import "./Account.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { BsChevronRight } from "react-icons/bs";
import { BsChevronLeft } from "react-icons/bs";

const Account = ({ url }) => {
    const navigate = useNavigate();
    const { token,admin } = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(true);

    const [account, setAccount] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAccount = async (page) => {
      try{
        const response = await axios.post(`${url}/api/user/getaccount`, {page});
        if (response.data.success) {
          setAccount(response.data.data);
          if (response.data.data.length < 10) {
                    setHasMore(false);
                }
        } else {
          setHasMore(false);
        }
      }
      catch (error) {
            console.log(error);
            toast.error('Error fetching customers:', error);
            setHasMore(false);
        }
      };

    useEffect(() => {
        if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("token")) {
          toast.error("Please Login First");
          navigate("/");
        }
        fetchAccount(page);
      }, [page]);

  return (
    <div className="Account-list">
      <h3>Customer Account</h3>
      <div className="Account-list-nav">
      <div className="Account-list-left">
      <label >Search account: </label>
      <input type="text" placeholder="ID/Phone.no" />
      <img src={assets.search} alt="search" className="search-icon"/>
      </div>
      <div className="Account-list-right">
      {page > 1 && (
      <button className="Account-list-button" onClick={() => {setPage(prev => prev - 1);setHasMore(true)}}><BsChevronLeft />Back</button>
      )}
      <button className="Account-list-button" onClick={() => {
          if(!hasMore){
            toast.error("No more data");
          }else{
            setPage(prev => prev + 1)
          }
          }}>Next<BsChevronRight /></button>
      
      {/*!hasMore && <label>No more customers.</label>*/}
      </div>
      </div>

      <div className="Account-table">
        {account.map((item, index) => {
          return (
            <div className="Account-container" key={index}>
              <div className="Account-container-info">
                <p className="Account-container-info-item">UserID : {item.userId}</p>
              <p className="Account-container-info-item">Username : {item.username}</p>
              <p className="Account-container-info-item">Email : {item.email}</p>
              <p className="Account-container-info-item">Address : {item.address}</p>
              <p className="Account-container-info-item">Phone Number : {item.phoneNumber}</p>
              </div>
              <div className="Account-container-Button">
              <button className="Account-Button"><img className="account-pencil" src={assets.pencil}/> Edit</button>
              <button className="Account-Button">Activate</button>
              <button className="Account-Button">Inactivate</button>
              </div>
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