import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

export const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);
    console.log('Received food list in FoodDisplay:', food_list); // 添加调试日志

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near to you</h2>
            <div className="food-display-list">
                {food_list.map((item) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};