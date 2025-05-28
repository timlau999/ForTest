// frontend/src/components/Order/Order.jsx
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Order.css';

const Order = ({ backendUrl }) => {
    const { token } = useContext(StoreContext);
    const customerId = localStorage.getItem('customerId');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    console.log('Token:', token);

    useEffect(() => {
        const fetchOrders = async () => {
            if (token && customerId) {
                try {
                    console.log('Fetching orders with customerId:', customerId);

                    const orderResponse = await axios.get(`${backendUrl}/api/order/${customerId}`, {
                        headers: { token }
                    });
                    console.log('Order response data:', orderResponse.data);

                    if (Array.isArray(orderResponse.data)) {
                        setOrders(orderResponse.data);
                    } else {
                        setError('API response is not an array');
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    setError('Error fetching orders');
                }
            } else {
                console.log('Token or customerId is missing');
            }
        };

        fetchOrders();
    }, [token, customerId, backendUrl]);

    return (
        <div className="order" id="order">
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Order Details</h1> 
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.length > 0 ? (
                <div>
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-item">
                            <p>Order ID: {order.orderId}</p>
                            <p>Order Date: {order.orderDate}</p>
                            <p>Order Status: {order.orderStatus}</p>
                            <p>Total Amount: ${order.totalAmount}</p>
                            <p>Payment Status: {order.paymentStatus}</p>
                            <p>Points Used: {order.pointsUsed || 0} pts</p>
                            <h3>Order Items</h3>
                                 <div className="order-item-items">
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((item) => (
                                        <div key={item.orderItemId} className="order-item-card">
                                            <img src={`/menuItem_${item.menuItemId}.png`} alt={item.MenuItem?.name || 'unknown'} />
                                            <div className="order-item-info">
                                                <p>Item Name: {item.MenuItem?.name || 'unknown'}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Unit Price: ${item.unitPrice}</p>
                                                <p>Total Price: ${item.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No items in this order</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '18px', color: '#747474' }}>No order now</p>
            )}
        </div>
    );
};

export default Order;