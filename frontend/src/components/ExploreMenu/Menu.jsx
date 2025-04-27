import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = ({ category, setCategory }) => {
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/menus');
        console.log('Menu data response:', response.data); 

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
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes.</p>
      <div className="explore-menu-list">
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
      <hr></hr>
    </div>
  );
};

export default Menu;
