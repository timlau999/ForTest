import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './MenuItem.css';

const MenuItem = ({ id, name, price, description, image, rating }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const imgPath = `/${image}`; 
    const numericId = parseInt(id);
    
    let numericRating = 0;
    try {
        numericRating = parseFloat(rating) || 0;
    } catch (error) {
        console.error(`Error converting rating for ${name}:`, error);
        numericRating = 0;
    }

    // Generate star rating component
    const renderRatingStars = (ratingValue) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{ 
                        color: i <= ratingValue ? '#ffc107' : '#ddd',
                        fontSize: '18px',
                        marginRight: '2px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className='menuItem-item'>
            <div className="menuItem-item-img-container">
                <img className='menuItem-item-image' src={imgPath} alt={name} />
                {!cartItems[numericId] ? (
                    <img className="add" onClick={() => addToCart(numericId)} src="/add_icon_white.png" alt="Add to cart" />
                ) : (
                    <div className='menuItem-item-counter'>
                        <img onClick={() => removeFromCart(numericId)} src="/remove_icon_red.png" alt="Remove from cart" />
                        <p>{cartItems[numericId]}</p>
                        <img onClick={() => addToCart(numericId)} src="/add_icon_green.png" alt="Add to cart" />
                    </div>
                )}
            </div>
            <div className="menuItem-item-info">
                <div className="menuItem-item-name-rating">
                    <p>{name}</p>
                    <div className="menuItem-rating-stars">
                        {renderRatingStars(numericRating)}
                        <span style={{ marginLeft: '5px', fontSize: '14px' }}>
                            {numericRating.toFixed(1)}
                        </span>
                    </div>
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