import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { use } from "react";
import { toast } from "react-toastify";
import {io} from 'socket.io-client';

export const StoreContext = createContext(null);

const socket = io('http://localhost:4000', {query: {role: 'client'}});

const StoreContextProvider = (props) => {
    const { backendUrl } = props;
    const [cartItems, setCartItems] = useState({});
    const [menuItem_list, setMenuItemList] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [token, setToken] = useState(null); 
    const [table_list, setTableList] = useState([]);
    const customerId = localStorage.getItem('customerId');
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [reservationF_list, setReservationF_list] = useState();
    const [reservationFtable_list, setReservationFtable_list] = useState();
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }

        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/menuItem`);
                console.log('API response:', response.data); 
                if (response.data.success) {
                    const formattedMenuItems = response.data.data.map(item => ({
                        _id: item._id.toString(),
                        name: item.name,
                        description: item.description,
                        price: parseFloat(item.price),
                        image: `menuItem_${item._id}.png`,
                        category: item.category,
                        rating: item.rating || 0
                    }));
                    setMenuItemList(formattedMenuItems);
                    console.log('Stored menuItem list in context:', formattedMenuItems); 
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

/*        const fetchUserPoints = async () => {
            if (customerId) {
                try {
                    const response = await axios.post(`${backendUrl}/api/points/get`, { customerId });
                    if (response.data.success) {
                        setUserPoints(response.data.points);
                    }
                } catch (error) {
                    console.error('Error fetching user points:', error);
                }
            }
        };
*/
        fetchMenuItems();
//        fetchUserPoints();
    }, [backendUrl, customerId]);

    const fetchtable = async () => {
            try{
                const response = await axios.get(`${backendUrl}/api/table/getTable`);
                console.log('API response:', response.data); 
                if (response.data.success) {
                    setTableList(response.data.data);
                    console.log('Stored table list in context:', response.data.data);
                } else {
                    console.log('Failed to fetch table list:', response.data.message);
                }          
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    useEffect(() => {
        fetchtable();
    }, []);
    useEffect(() => {
        socket.on('TableState_updated', () => {
            fetchtable();
        });
        return () => {
        socket.off('TableState_updated');
        };
    }, []);

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    const removeFromCart = (itemId) => {
        if (cartItems[itemId] > 1) {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        } else {
            const newCartItems = { ...cartItems };
            delete newCartItems[itemId];
            setCartItems(newCartItems);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = menuItem_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const usePoints = async (pointsToUse) => {
        if (customerId) {
            try {
                const orderId = null; 
                const response = await axios.post(`${backendUrl}/api/points/use`, {
                    customerId,
                    pointsToUse,
                    orderId
                });
                if (response.data.success) {
                    setUserPoints(userPoints - pointsToUse);
                }
            } catch (error) {
                console.error('Error using points:', error);
            }
        }
    };

    const setAuthToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const clearAuthToken = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const addReservation = async (userId, tableId, timeslot) => {
        if (!userId) {
            console.error('User ID is not available');
            toast.error('Please login to reserve a table');
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/table/addReservation`, {
                userId,
                tableId,
                timeslot
            });
            console.log('API response:', response.data); 
            if (response.data.success) {
                console.log('Reservation added successfully:', response.data.data);
                toast.success('Reservation added successfully');
                //updateTableState(tableId);
            } else {
                console.log('Failed to add reservation:', response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error add new reservation:', error);
            toast.error(error);
        }
    };

    useEffect(() => {
        socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
        });

        socket.on('disconnect', () => {
        console.log('Disconnected from server');
        });
    }, []);

    useEffect(() => {
        socket.on('reservation_created', () => {
            getReservationF();
        });
        return () => {
        socket.off('reservation_created');
        };
    }, []);

    const updateTableState = async (tableId) => {
        try {
            const response = await axios.post(`${backendUrl}/api/table/updateTableState`, {
                tableId,
                state: 'reserved',
            });
            console.log('API response:', response.data); 
            if (response.data.success) {
                fetchtable();
                console.log('Table state updated successfully:', response.data.data);
            } else {
                console.log('Failed to update table state:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating table state:', error);
        }
    };

    const updateReservation = async (userId, reservationStatus) => {
        try {
            const response = await axios.post(`${backendUrl}/api/table/updateReservation`,{
               userId,
               reservationStatus 
            });
            if (response.data.success) {
                console.log('Reservation removed successfully:', response.data.data);
                toast.success('Reservation removed successfully');
            } else {
                console.log('Failed to remove reservation:', response.data.message);
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('Error removing reservation:', error);
            toast.error(error);
        }
    };

    useEffect(() => {
        socket.on('reservation_updated', () => {
            getReservationF();
        });
        return () => {
        socket.off('reservation_updated');
        };
    }, []);

    const getReservationF = async () => {
        const userId = localStorage.getItem('userId');
        try{
            const response = await axios.post(`${backendUrl}/api/table/getReservationF`,{
                userId
            });
            if (response.data.success) {
                console.log("test");
                console.log(response.data.data);
                setReservationF_list(response.data.data[0]);
            } else {
                console.log(response.data.data);
            }
        }catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        getReservationF();
    }, []);

    const getReservationFtable = async (tableId) => {
        
        try{
            const response = await axios.post(`${backendUrl}/api/table/getReservationF`,{
                tableId
            });
            if (response.data.success) {
              setReservationFtable_list(response.data.data);
            } else {
              console.log(response.data.data);
            }
        }catch(error){
            console.error(error);
        }
    };

    const contextValue = {
        menuItem_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        userPoints,
        usePoints,
        backendUrl,
        token,
        setAuthToken,
        clearAuthToken,
        table_list,
        addReservation,
        updateReservation,
        userId,
        username,
        getReservationF,
        reservationF_list,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;    