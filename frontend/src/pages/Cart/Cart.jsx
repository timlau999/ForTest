import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, menuItem_list, getTotalCartAmount, userPoints, usePoints } = useContext(StoreContext);
    const navigate = useNavigate();
    const [pointsToUse, setPointsToUse] = useState('');

    const totalAmount = getTotalCartAmount();
    const maxPointsToUse = Math.min(totalAmount * 10, userPoints);
    const pointsValue = pointsToUse ? Math.min(parseInt(pointsToUse) || 0, maxPointsToUse) : 0;
    const finalAmount = totalAmount - pointsValue / 10;

    const handlePointsChange = (e) => {
        const inputPoints = parseInt(e.target.value) || 0;
        setPointsToUse(inputPoints <= maxPointsToUse ? inputPoints.toString() : maxPointsToUse.toString());
    };

    const handleSubmitPoints = () => {
        usePoints(pointsValue);
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-item-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <hr />
                <br />
                {menuItem_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div className="cart-items-item" key={item._id}>
                                <img src={item.image} alt={item.name} />
                                <p>{item.name}</p>
                                <p>${item.price}</p>
                                <p>{cartItems[item._id]}</p>
                                <p>${item.price * cartItems[item._id]}</p>
                                <p className='cross' onClick={() => removeFromCart(item._id)}>x</p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <hr />
            <div className="card-bottom">
                <div className="cart-total">
                    <h2>Cart totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${totalAmount}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Points Deducted</p>
                            <p>{pointsValue} pts (${pointsValue / 10})</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${finalAmount}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>Proceed To Checkout</button>
                </div>
                <div className="cart-points">
                    <div>
                        <p>Enter the points you want to use</p>
                        <div className="cart-points-input">
                            <input
                                type="number"
                                placeholder="Points"
                                value={pointsToUse}
                                onChange={handlePointsChange}
                            />
                            <button onClick={handleSubmitPoints}>Submit</button>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <p>Your remaining points: {userPoints - pointsValue}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;