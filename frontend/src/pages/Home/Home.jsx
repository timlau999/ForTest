import React, { useState } from 'react';
import Menu from '../../components/ExploreMenu/Menu';
import { MenuItemDisplay } from '../../components/MenuItemDisplay/MenuItemDisplay';
import Header from '../../components/Header/Header';
import Order from '../../components/Order/Order'; 
import './Home.css';


const Home = () => {
  const [category,setCategory]=useState("All");
  return (
    <div>
    <Header/>
    <Menu category={category} setCategory={setCategory}/>
    <MenuItemDisplay category={category} />
    <Order/>
    </div>
  )
}

export default Home
