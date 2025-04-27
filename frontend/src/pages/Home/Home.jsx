import React, { useState } from 'react';
import AppDownload from '../../components/AppDownload/AppDownload';
import Menu from '../../components/ExploreMenu/Menu';
import { MenuItemDisplay } from '../../components/MenuItemDisplay/MenuItemDisplay';
import Header from '../../components/Header/Header';
import './Home.css';


const Home = () => {
  const [category,setCategory]=useState("All");
  return (
    <div>
    <Header/>
    <Menu category={category} setCategory={setCategory}/>
    <MenuItemDisplay category={category} />
    <AppDownload/>
    </div>
  )
}

export default Home