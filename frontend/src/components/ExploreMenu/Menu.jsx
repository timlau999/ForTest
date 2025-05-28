import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Menu.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // 引入箭頭圖標

const Menu = ({ category, setCategory, backendUrl }) => {
  const [menuList, setMenuList] = useState([]);
  const menuContainerRef = useRef(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/menus`);
        if (Array.isArray(response.data.data)) {
          setMenuList(response.data.data);
        } else {
          setMenuList([]);
          console.error('Error: Backend data is not an array', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
        setMenuList([]);
      }
    };
    fetchMenus();
  }, [backendUrl]);

  // 向左滾動
  const scrollLeft = () => {
    if (menuContainerRef.current) {
      menuContainerRef.current.scrollBy({
        left: -300, // 每次滾動300px
        behavior: 'smooth'
      });
    }
  };

  // 向右滾動
  const scrollRight = () => {
    if (menuContainerRef.current) {
      menuContainerRef.current.scrollBy({
        left: 300, // 每次滾動300px
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes.</p>
      
      <div className="menu-navigation-container">
        <button className="nav-arrow left-arrow" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        
        <div className="explore-menu-list" ref={menuContainerRef}>
          {menuList.length > 0 ? (
            menuList.map((item, index) => (
              <div 
                key={item.menuId || index} 
                onClick={() => setCategory(prev => prev === item.description ? "All" : item.description)} 
                className="explore-menu-list-item"
              >
                <img 
                  className={category === item.description ? "active" : ""} 
                  src={`/menu_${item.menuId}.png`} 
                  alt={item.description} 
                />
                <p>{item.description}</p>
              </div>
            ))
          ) : (
            <p className="loading-tip">Loading menu categories...</p>
          )}
        </div>
        
        <button className="nav-arrow right-arrow" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
      
      <hr></hr>
    </div>
  );
};

export default Menu;