import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { use } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

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
                        category: item.category
                    }));
                    setMenuItemList(formattedMenuItems);
                    console.log('Stored menuItem list in context:', formattedMenuItems); 
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchUserPoints = async () => {
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

        fetchMenuItems();
        fetchUserPoints();
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

    const addReservation = async (userId, tableId) => {
        if (!userId) {
            console.error('User ID is not available');
            alert('Please login to reserve a table');
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/table/addReservation`, {
                userId,
                tableId,
            });
            console.log('API response:', response.data); 
            if (response.data.success) {
                console.log('Reservation added successfully:', response.data.data);
                alert('Reservation added successfully');
                updateTableState(tableId);
            } else {
                console.log('Failed to add reservation:', response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error add new reservation:', error);
        }
    };

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

    const removeReservation = async (reservationId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/table/${reservationId}`);
            console.log('API response:', response.data); 
            if (response.data.success) {
                console.log('Reservation removed successfully:', response.data.data);
            } else {
                console.log('Failed to remove reservation:', response.data.message);
            }
        } catch (error) {
            console.error('Error removing reservation:', error);
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
        removeReservation,
        userId,
        username,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;    