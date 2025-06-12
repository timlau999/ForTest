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
import { BsSearch } from "react-icons/bs";

const Account = ({ url }) => {
    const navigate = useNavigate();
    const { token, admin } = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState("admin");
    const [isLoading, setIsLoading] = useState(true);

    const [adminData, setAdminData] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const [customerData, setCustomerData] = useState([]);

    const [adminPage, setAdminPage] = useState(1);
    const [staffPage, setStaffPage] = useState(1);
    const [customerPage, setCustomerPage] = useState(1);

    const [adminHasMore, setAdminHasMore] = useState(true);
    const [staffHasMore, setStaffHasMore] = useState(true);
    const [customerHasMore, setCustomerHasMore] = useState(true);

    const [adminSearch, setAdminSearch] = useState("");
    const [staffSearch, setStaffSearch] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");

    const fetchAdmin = async (page, search = "") => {
        try {
            const response = await axios.post(`${url}/api/user/getAdmin`, { page, search });
            if (response.data.success) {
                setAdminData(response.data.data);
                if (response.data.data.length < 10) {
                    setAdminHasMore(false);
                }
            } else {
                setAdminHasMore(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error fetching admins:', error);
            setAdminHasMore(false);
        }
    };

    const fetchStaff = async (page, search = "") => {
        try {
            const response = await axios.post(`${url}/api/user/getStaff`, { page, search });
            if (response.data.success) {
                setStaffData(response.data.data);
                if (response.data.data.length < 10) {
                    setStaffHasMore(false);
                }
            } else {
                setStaffHasMore(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error fetching staff:', error);
            setStaffHasMore(false);
        }
    };

    const fetchCustomer = async (page, search = "") => {
        try {
            const response = await axios.post(`${url}/api/user/getCustomer`, { page, search });
            if (response.data.success) {
                setCustomerData(response.data.data);
                if (response.data.data.length < 10) {
                    setCustomerHasMore(false);
                }
            } else {
                setCustomerHasMore(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error fetching customers:', error);
            setCustomerHasMore(false);
        }
    };

    const fetchData = (page, search = "") => {
        switch (activeTab) {
            case "admin":
                fetchAdmin(page, search);
                break;
            case "staff":
                fetchStaff(page, search);
                break;
            case "customer":
                fetchCustomer(page, search);
                break;
            default:
                break;
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.search.value.trim();
        
        switch (activeTab) {
            case "admin":
                setAdminSearch(searchValue);
                setAdminPage(1);
                fetchAdmin(1, searchValue);
                break;
            case "staff":
                setStaffSearch(searchValue);
                setStaffPage(1);
                fetchStaff(1, searchValue);
                break;
            case "customer":
                setCustomerSearch(searchValue);
                setCustomerPage(1);
                fetchCustomer(1, searchValue);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem("admin") && !sessionStorage.getItem("token")) {
            toast.error("Please Login First");
            navigate("/");
        }
        fetchData(1);
    }, [activeTab, url, navigate]);

    const getCurrentData = () => {
        switch (activeTab) {
            case "admin":
                return adminData;
            case "staff":
                return staffData;
            case "customer":
                return customerData;
            default:
                return [];
        }
    };

    const getCurrentPage = () => {
        switch (activeTab) {
            case "admin":
                return adminPage;
            case "staff":
                return staffPage;
            case "customer":
                return customerPage;
            default:
                return 1;
        }
    };

    const getCurrentHasMore = () => {
        switch (activeTab) {
            case "admin":
                return adminHasMore;
            case "staff":
                return staffHasMore;
            case "customer":
                return customerHasMore;
            default:
                return true;
        }
    };

    const setCurrentPage = (page) => {
        switch (activeTab) {
            case "admin":
                setAdminPage(page);
                break;
            case "staff":
                setStaffPage(page);
                break;
            case "customer":
                setCustomerPage(page);
                break;
            default:
                break;
        }
    };

    const setCurrentHasMore = (hasMore) => {
        switch (activeTab) {
            case "admin":
                setAdminHasMore(hasMore);
                break;
            case "staff":
                setStaffHasMore(hasMore);
                break;
            case "customer":
                setCustomerHasMore(hasMore);
                break;
            default:
                break;
        }
    };

    return (
        <div className="Account-list">
            <div className="Account-tabs">
                <button 
                    className={`Account-tab ${activeTab === "admin" ? "active" : ""}`}
                    onClick={() => setActiveTab("admin")}
                >
                    Admin Account
                </button>
                <button 
                    className={`Account-tab ${activeTab === "staff" ? "active" : ""}`}
                    onClick={() => setActiveTab("staff")}
                >
                    Staff Account
                </button>
                <button 
                    className={`Account-tab ${activeTab === "customer" ? "active" : ""}`}
                    onClick={() => setActiveTab("customer")}
                >
                    Customer Account
                </button>
            </div>

            <div className="Account-list-nav">
                <div className="Account-list-left">
                    <form onSubmit={handleSearch}>
                        <label>Search account: </label>
                        <input 
                            type="text" 
                            placeholder="ID/Phone.no" 
                            name="search"
                            defaultValue={
                                activeTab === "admin" ? adminSearch : 
                                activeTab === "staff" ? staffSearch : customerSearch
                            }
                        />
                        <button type="submit" className="search-button">
                            <BsSearch />
                        </button>
                    </form>
                </div>
                <div className="Account-list-right">
                    {getCurrentPage() > 1 && (
                        <button 
                            className="Account-list-button" 
                            onClick={() => {
                                setCurrentPage(prev => prev - 1);
                                setCurrentHasMore(true);
                                fetchData(getCurrentPage() - 1, 
                                    activeTab === "admin" ? adminSearch : 
                                    activeTab === "staff" ? staffSearch : customerSearch
                                );
                            }}
                        >
                            <BsChevronLeft />Back
                        </button>
                    )}

                    <button 
                        className="Account-list-button" 
                        onClick={() => {
                            if(!getCurrentHasMore()){
                                toast.error("No more data");
                            }else{
                                setCurrentPage(prev => prev + 1);
                                fetchData(getCurrentPage() + 1, 
                                    activeTab === "admin" ? adminSearch : 
                                    activeTab === "staff" ? staffSearch : customerSearch
                                );
                            }
                        }}
                    >
                        Next<BsChevronRight />
                    </button>

                    {!getCurrentHasMore() && <label className="no-more-label">No more data.</label>}
                </div>
            </div>

            <div className="Account-table">
                {getCurrentData().map((item, index) => {
                    const user = item.User || item;
                    
                    return (
                        <div className="Account-container" key={index}>
                            <div className="Account-container-info">
                                <p className="Account-container-info-item">UserID : {user.userId}</p>
                                <p className="Account-container-info-item">Username : {user.username}</p>
                                <p className="Account-container-info-item">Email : {user.email}</p>
                                <p className="Account-container-info-item">Address : {user.address}</p>
                                <p className="Account-container-info-item">Phone Number : {user.phoneNumber}</p>

                                {activeTab === "customer" && item.CustomerProfile && (
                                    <>
                                        <p className="Account-container-info-item">Height : {item.CustomerProfile.height || "N/A"}</p>
                                        <p className="Account-container-info-item">Weight : {item.CustomerProfile.weight || "N/A"}</p>
                                    </>
                                )}
                            </div>
                            <div className="Account-container-Button">
                                <button className="Account-Button">
                                    <img className="account-pencil" src={assets.pencil} /> Edit
                                </button>

                                {activeTab === "admin" || activeTab === "staff" ? (
                                    <>
                                        <button className="Account-Button">Activate</button>
                                        <button className="Account-Button">Inactivate</button>
                                    </>
                                ) : (
                                    <button className="Account-Button">View Details</button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {getCurrentData().length === 0 && (
                    <div className="no-data-message">
                        No {activeTab} accounts found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;