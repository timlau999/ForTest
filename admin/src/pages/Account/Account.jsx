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
import { BsPencil } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
import { BsArrowClockwise } from "react-icons/bs";
import { BsPersonPlus } from "react-icons/bs";

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

    const [inputSearch, setInputSearch] = useState("");

    const [userPoints, setUserPoints] = useState();
    const [userReviews, setUserReviews] = useState();

    const [openCreateAc, setOpenCreateAc] = useState(false);
    const [data, setData] = useState({
          username: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          accountType: "admin",
        });

    const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("address", data.address);
    formData.append("accountType", data.accountType);
    formData.append("permissionId", 1);

    const response = await axios.post(`${url}/api/user/register`, formData, {headers: {"Content-Type": "application/json"}});
    if (response.data.success) {
      setData({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        accountType: "",
      });
      setOpenCreateAc(!openCreateAc);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

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

    const fetchPoints = async (userId) => {
            try {
                const response = await axios.post(`${url}/api/points/getPointsA`, { userId });
                if(response.data.success) {
                    setUserPoints((prev) => ({...prev, [userId]: response.data.points}));
                }
            } catch (err) {
                console.error(err);
            }
        };
    useEffect(() => {
        /*for (let i = 0; i < customerData.length; i++) {
           fetchPoints(customerData[i].userId);
        };*/
        if (!customerData || customerData.length === 0) return;
        customerData.forEach((customer) => {
        fetchPoints(customer.userId);
        fetchReviews(customer.userId);
        });
    }, [customerData]);

    const fetchReviews = async (userId) => {
        try {
            const response = await axios.post(`${url}/api/menuItem/getReviewsA`, { userId });
            if (response.data.success) {
                console.log("Reviews fetched successfully:", response.data.data);
                setUserReviews((prev) => ({...prev, [userId]: response.data.data}));
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        console.log("User Reviews:", userReviews);
    }, [userReviews]);

    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            toast.error("Please Login First");
            navigate("/");
        }else if (!sessionStorage.getItem("admin")) {
            toast.error("You are not an admin");
            navigate("/orders");
        }else{
            fetchData(1);
        }
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

    const profileCard = (item, index) => { 
        const user = item.User || item;
        return(
            <div className="profile-card" key={index}>
                        <div className="profile-image"></div>
                        <div className="profile-info">
                        <p className="profile-name">Name: {user.username}</p>
                        <div className="profile-title">@ {user.userId}</div>
                        <div className="profile-bio">
                        <p>Email : {user.email} </p>
                        <p>Address : {user.address} </p>
                        <p>Phone Number : {user.phoneNumber}</p>
                        {activeTab === "customer" && item.CustomerProfile && (
                                    <>
                                        <p className="Account-container-info-item">Height : {item.CustomerProfile.height || "N/A"}</p>
                                        <p className="Account-container-info-item">Weight : {item.CustomerProfile.weight || "N/A"}</p>
                                    </>
                                )}
                        </div>
                        </div>
                        {activeTab === "staff" || activeTab === "customer" ?
                        <div className="social-links">
                            <button className="social-btn A"
                                onClick={() => {
                                    toast.info((t) => ( 
                                    <div>Update the user status?
                                    <button onClick={() => {
                                    toast.dismiss(t.id);
                                    updateUserStatus(user.userId, "active");
                                    }}>Yes</button>
                                    <button onClick={() => toast.dismiss(t.id)}>No</button>
                                    </div>
                                    ),{autoClose: false, position: "bottom-center",});
                                }}
                            ><BsCheck />
                            </button>
                            <button className="social-btn B" 
                                onClick= { () => {
                                    toast.info((t) => ( 
                                    <div>Update the user status?
                                    <button onClick={() => {
                                    toast.dismiss(t.id);
                                    updateUserStatus(user.userId, "inactive");
                                    }}>Yes</button>
                                    <button onClick={() => toast.dismiss(t.id)}>No</button>
                                    </div>
                                    ),{autoClose: false, position: "bottom-center",});
                                }}
                            ><BsX />
                            </button>
                            <button className="social-btn C">
                                
                            </button>
                            <button className="social-btn D">
                                
                            </button>
                        </div> : null}
                        {/*<button className="cta-button">Message</button>*/}
                        <div className="stats">
                            <div className="stat-item">
                            <div className="stat-value">
                                {userPoints && userPoints[user.userId] ? userPoints[user.userId] : "n/a"}
                            </div>
                            <div className="stat-label">Point</div>
                            </div>
                            <div className="stat-item">
                            <label className="stat-value-review">
                                {userReviews && userReviews[user.userId] ? userReviews[user.userId].length : "n/a"}
                            </label>
                            <div className="stat-label">Review</div>
                            </div>
                            <div className="stat-item">
                            <div className="stat-value">~</div>
                            <div className="stat-label">Status</div>
                            </div>
                        </div>
                        </div>
        );
    };

    const updateUserStatus = async (userId, status) => {
        try {
            const response = await axios.post(`${url}/api/user/status`, { userId, status });
            if (response.data.success) {
                toast.success("User status updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    return (
        <div className="Account-list">
            <div className="Account-tabs">
                <button 
                    className={`Account-tab ${activeTab === "admin" ? "active" : ""}`}
                    onClick={() => {setActiveTab("admin");setInputSearch("");}}
                >
                    Admin Account
                </button>
                <button 
                    className={`Account-tab ${activeTab === "staff" ? "active" : ""}`}
                    onClick={() => {setActiveTab("staff");setInputSearch("");}}
                >
                    Staff Account
                </button>
                <button 
                    className={`Account-tab ${activeTab === "customer" ? "active" : ""}`}
                    onClick={() => {setActiveTab("customer");setInputSearch("");}}
                >
                    Customer Account
                </button>
            </div>

            <div className="Account-list-nav">
                <div className="Account-list-left">
                    
                        <label>Search account: </label><BsSearch />
                        <input 
                            type="text" 
                            placeholder="Name/ID/Phone.no" 
                            name="search"
                            value={inputSearch} 
                            onChange={e => setInputSearch(e.target.value)}
                        />
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

                    {/*!getCurrentHasMore() && <label className="no-more-label">No more data.</label>*/}
                </div>
            </div>

            <div className="Account-panel">
                {activeTab === "admin" || activeTab === "staff" ? 
                <button className="create-btn" onClick={()=>setOpenCreateAc(!openCreateAc)}>
                    <BsPersonPlus style={{marginRight: "5px"}}/> Create account</button> : null}
                {openCreateAc? 
                          <div className="edit-menuitem-container">
                          <BsXCircle onClick={() => setOpenCreateAc(!openCreateAc)}/>
                            <BsArrowClockwise onClick={() => setData({
                                username: "",
                                email: "",
                                password: "",
                                phoneNumber: "",
                                address: "",
                                accountType: "admin",
                                })}/>
                            <form onSubmit={onSubmitHandler} className="flex-col">
                              Create Account
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
                          <div className="edit-category-price">
                            
                            <div className="edit-category flex-col">
                              <p>Account Type</p>
                              <select
                                name="accountType"
                                required
                                onChange={onChangeHandler}
                                value={data.accountType}>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                              </select>
                            </div>
                            
                          </div>
                          <button type="submit" className="edit-btn">
                            CREATE
                          </button>
                        </form>
                      </div>
                
                : null}

                <div className="Account-table">
                {!inputSearch && getCurrentData().map((item, index) => (
                    profileCard(item, index)
                ))}
                {inputSearch && getCurrentData().filter(item => {
                    const user = item.User || item;
                    return (
                        user.username.toLowerCase().includes(inputSearch.toLowerCase()) ||
                        user.userId.toString().includes(inputSearch) ||
                        //user.email.toLowerCase().includes(inputSearch.toLowerCase()) ||
                        //user.address.toLowerCase().includes(inputSearch.toLowerCase()) ||
                        user.phoneNumber.includes(inputSearch)
                    );
                }).map((item, index) => (
                    profileCard(item, index)
                ))}

                {getCurrentData().length === 0 && (
                    <div className="no-data-message">
                        No {activeTab} accounts found.
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default Account;