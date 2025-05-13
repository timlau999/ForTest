import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import MenuItem from '../MenuItem/MenuItem';
import './MenuItemDisplay.css';

export const MenuItemDisplay = ({ category }) => {
    const { menuItem_list } = useContext(StoreContext);
    console.log('Received menuItem list in MenuItemDisplay:', menuItem_list); 

    return (
        <div className='menuItem-display' id='menuItem-display'>
            <h2>Top dishes near to you</h2>
            <div className="menuItem-display-list">
                {menuItem_list.map((item) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <MenuItem
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
