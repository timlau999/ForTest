import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/menuItem');
                console.log('API response:', response.data); // 查看 API 响应数据
                if (response.data.success) {
                    const formattedMenuItems = response.data.data.map(item => ({
                        _id: item._id.toString(),
                        name: item.name,
                        description: item.description,
                        price: parseFloat(item.price),
                        image: `food_${item._id}.png`,
                        category: item.category
                    }));
                    setFoodList(formattedMenuItems);
                    console.log('Stored food list in context:', formattedMenuItems); // 查看存储的数据
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMenuItems();
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
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;