import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const { backendUrl } = props;
    const [cartItems, setCartItems] = useState({});
    const [menuItem_list, setMenuItemList] = useState([]);
    const [userPoints, setUserPoints] = useState(0); // 添加 userPoints 状态
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
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
                const orderId = null; // 这里需要根据实际情况获取订单 ID
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

    const contextValue = {
        menuItem_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        userPoints, // 添加 userPoints 到 contextValue
        usePoints, // 添加 usePoints 到 contextValue
        backendUrl
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;