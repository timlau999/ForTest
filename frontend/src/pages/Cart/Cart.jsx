import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Cart = () => {
    const { cartItems, removeFromCart, menuItem_list, getTotalCartAmount, backendUrl, token } = useContext(StoreContext);
    const navigate = useNavigate();
    const [pointsToUse, setPointsToUse] = useState('');
    const customerId = localStorage.getItem('customerId'); 
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPayPal, setShowPayPal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchPoints = async () => {
            if (!customerId) {
                setError('Customer ID not found');
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetch(`${backendUrl}/api/points/${customerId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch points');
                }
                
                const data = await response.json();
                setUserPoints(data.points);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setUserPoints(0);
                setError(null);
                setLoading(false);
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/paymentmethods`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payment methods');
                }

                const data = await response.json();
 
                const methodsWithImages = data.paymentMethods.map(method => {
                    return {
                        ...method,
                        image: `/payment/${method.paymentMethodName.toLowerCase().replace(' ', '_')}.png`
                    };
                });
                setPaymentMethods(methodsWithImages);
            } catch (err) {
                console.error(err);
            }
        };
        
        fetchPoints();
        fetchPaymentMethods();
    }, [customerId, backendUrl, token]);

    const totalAmount = getTotalCartAmount();
    const maxPointsToUse = userPoints; 
    const pointsValue = pointsToUse ? Math.min(parseInt(pointsToUse) || 0, maxPointsToUse) : 0;
    const finalAmount = totalAmount - pointsValue / 10;

    const handlePointsChange = (e) => {
        const input = e.target.value;
        
        if (input === '') {
            setPointsToUse('');
            return;
        }
        
        if (/^\d+$/.test(input)) {
            const inputPoints = parseInt(input);
            
            if (inputPoints > maxPointsToUse) {
                setPointsToUse(maxPointsToUse.toString());
            } else {
                setPointsToUse(input);
            }
        }
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
    };

    const selectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
        setShowPaymentModal(false);
        
        if (method.paymentMethodId === 1) { 
            setShowPayPal(true);
        } else {
            placeOrder(method.paymentMethodId);
        }
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: finalAmount.toFixed(2)
                    }
                }
            ]
        });
    };

    const onApprove = async (data, actions) => {
        placeOrder(1);
    };

    const placeOrder = async (paymentMethodId) => {
        if (pointsValue > 0) {
            try {
                const response = await fetch(`${backendUrl}/api/points/${customerId}/use`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ pointsToUse: pointsValue })
                });
                
                const data = await response.json();
                if (!data.success) {
                    alert(data.message || 'Failed to use points');
                    return;
                }
                setUserPoints(data.points);
            } catch (err) {
                console.error(err);
                alert('Error using points');
                return;
            }
        }

        try {
            const response = await fetch(`${backendUrl}/api/order/place`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    customerId, 
                    items: menuItem_list.filter(item => cartItems[item._id] > 0).map(item => ({
                        menuItemId: item._id,
                        quantity: cartItems[item._id],
                        unitPrice: item.price,
                        totalPrice: item.price * cartItems[item._id]
                    })),
                    amount: finalAmount,
                    pointsToUse: pointsValue,
                    paymentMethodId
                })
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                navigate('/order');
            } else {
                console.error(dataResponse.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": "AZTUwfMptslRno6C0KoC3nsEpFClYKq0nKWj0S1aaaU81GpB65XFZFrRwvUwoHsrKggPUVh_R2iyaLKC" }}>
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
                        {!showPayPal && <button onClick={handleCheckout}>Proceed To Checkout</button>}
                        {showPayPal && (
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                            />
                        )}
                    </div>
                    <div className="cart-points">
                        <div>
                            <p>Enter points to use</p>
                            <div className="cart-points-input">
                                <input
                                    type="number"
                                    placeholder="Points"
                                    value={pointsToUse}
                                    onChange={handlePointsChange}
                                    min="0"
                                    max={maxPointsToUse}
                                />
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                {loading ? (
                                    <p>Loading points...</p>
                                ) : error ? (
                                    <p style={{ color: 'red' }}>{error}</p>
                                ) : (
                                    <p>Your available points: {userPoints}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            {showPaymentModal && (
    <div className="payment-modal">
        <div className="payment-modal-content">
            <h3>Select Payment Method</h3>
            <div className="payment-methods-container">
                {paymentMethods.map(method => (
                    <div 
                        key={method.paymentMethodId}
                        className={`payment-method-option ${selectedPaymentMethod?.paymentMethodId === method.paymentMethodId ? 'selected' : ''}`}
                        onClick={() => setSelectedPaymentMethod(method)}
                    >
                        <img 
                            src={`/payment/PaymentMethod_${method.paymentMethodId}.png`} 
                            alt={method.paymentMethodName} 
                            className="payment-icon"
                        />
                        <span>{method.paymentMethodName}</span>
                    </div>
                ))}
            </div>
            <div className="modal-actions">
                <button 
                    className="modal-btn confirm-payment-btn"
                    onClick={() => {
                        if (selectedPaymentMethod) {
                            setShowPaymentModal(false);
                            if (selectedPaymentMethod.paymentMethodId === 1) {
                                setShowPayPal(true);
                            } else {
                                placeOrder(selectedPaymentMethod.paymentMethodId);
                            }
                        } else {
                            alert('Please select a payment method');
                        }
                    }}
                    disabled={!selectedPaymentMethod}
                >
                    Confirm Payment
                </button>
                <button 
                    className="modal-btn close-modal-btn"
                    onClick={() => setShowPaymentModal(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
            </div>
        </PayPalScriptProvider>
    );
};

export default Cart;