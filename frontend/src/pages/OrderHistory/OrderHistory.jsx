// ForTest/frontend/src/pages/OrderHistory/OrderHistory.jsx
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = ({ backendUrl }) => {
    const { token } = useContext(StoreContext);
    const customerId = localStorage.getItem('customerId');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (token && customerId) {
                try {
                    const orderResponse = await axios.get(`${backendUrl}/api/order/${customerId}`, {
                        headers: { token }
                    });
                    if (Array.isArray(orderResponse.data)) {

                        const completedOrders = orderResponse.data.filter(
                            (order) => order.orderStatus === 'Order Completed'
                        );
                        setOrders(completedOrders);
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
        <div className="order-history">
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Order History</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.length > 0 ? (
                <div>
                    {orders.map((order) => {
                        const totalUsedPoints = (order.customer_points_usages || []).reduce((sum, usage) => sum + (usage.usedPoints || 0), 0);
                        return (
                            <div key={order.orderId} className="order-item">
                                <p>Order ID: {order.orderId}</p>
                                <p>Order Date: {order.orderDate}</p>
                                <p>Order Status: {order.orderStatus}</p>
                                <p>Total Amount: ${order.totalAmount}</p>
                                <p>Payment Status: {order.paymentStatus}</p>
                                <p>Points Used: {totalUsedPoints} pts</p>
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
                        );
                    })}
                </div>
            ) : (
                <p style={{ fontSize: '18px', color: '#747474' }}>No completed orders found.</p>
            )}
        </div>
    );
};

export default OrderHistory;