// frontend/src/components/Order/Order.jsx
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './Order.css';

const Order = () => {
    const { token, userId } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (token && userId) {
                try {
                    const customerResponse = await axios.get(`http://192.168.0.174:4000/api/customer/${userId}`, {
                        headers: { token }
                    });
                    const customerId = customerResponse.data.customerId;

                    const orderResponse = await axios.get(`http://192.168.0.174:4000/api/orders/${customerId}`, {
                        headers: { token }
                    });
                    setOrders(orderResponse.data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            }
        };

        fetchOrders();
    }, [token, userId]);

    return (
        <div className="order" id="order">
            {/* 添加标题 */}
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>Order Details</h2> 
            {orders.length > 0 ? (
                <div>
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-item">
                            <p>Order ID: {order.orderId}</p>
                            <p>Order Date: {order.orderDate}</p>
                            <p>Order Status: {order.orderStatus}</p>
                            <p>Total Amount: ${order.totalAmount}</p>
                            <p>Payment Status: {order.paymentStatus}</p>
                            <h3>Order Items</h3>
                            {order.items.map((item) => (
                                <div key={item.orderItemId}>
                                    <p>Item Name: {item.menuItemName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Unit Price: ${item.unitPrice}</p>
                                    <p>Total Price: ${item.totalPrice}</p>
                                </div>
                            ))}
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
