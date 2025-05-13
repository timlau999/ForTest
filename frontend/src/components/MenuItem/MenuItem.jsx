import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './MenuItem.css';

const MenuItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const imgPath = `/${image}`; 

    return (
        <div className='menuItem-item'>
            <div className="menuItem-item-img-container">
                <img className='menuItem-item-image' src={imgPath} alt={name} />
                {!cartItems[id] ? (
                    <img className="add" onClick={() => addToCart(id)} src="/add_icon_white.png" alt="Add to cart" />
                ) : (
                    <div className='menuItem-item-counter'>
                        <img onClick={() => removeFromCart(id)} src="/remove_icon_red.png" alt="Remove from cart" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src="/add_icon_green.png" alt="Add to cart" />
                    </div>
                )}
            </div>
            <div className="menuItem-item-info">
                <div className="menuItem-item-name-rating">
                    <p>{name}</p>
                    <img src="/rating_starts.png" alt="Rating stars" />
                </div>
                <p className="menuItem-item-desc">
                    {description}
                </p>
                <p className="menuItem-item-price">${price}</p>
            </div>
        </div>
    );
};

export default MenuItem;
