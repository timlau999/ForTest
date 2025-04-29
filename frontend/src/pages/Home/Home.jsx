// ForTest/frontend/src/pages/Home/Home.jsx
import React, { useState } from 'react';
import Menu from '../../components/ExploreMenu/Menu';
import { MenuItemDisplay } from '../../components/MenuItemDisplay/MenuItemDisplay';
import Header from '../../components/Header/Header';
import Order from '../../components/Order/Order'; 
import './Home.css';

const Home = ({ backendUrl }) => {
    const [category, setCategory] = useState("All");
    return (
        <div>
            <Header backendUrl={backendUrl} />
            <Menu category={category} setCategory={setCategory} backendUrl={backendUrl} />
            <MenuItemDisplay category={category} />
            <Order />
        </div>
    );
};

export default Home;
