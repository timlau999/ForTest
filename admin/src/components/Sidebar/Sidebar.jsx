import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='add' className="sidebar-option">
          <img className="sidebar-img" src={assets.add} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='list' className="sidebar-option">
          <img className="sidebar-img" src={assets.book_alt} alt="" />
          <p>Menu</p>
        </NavLink>
        <NavLink to='orders' className="sidebar-option">
          <img className="sidebar-img" src={assets.shopping_bag} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='Reservation' className="sidebar-option">
          <img className="sidebar-img" src={assets.chair_office} alt="" />
          <p>Reservation</p>
        </NavLink>
        <NavLink to='Account' className="sidebar-option">
          <img className="sidebar-img" src={assets.user} alt="" />
          <p>Account</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
