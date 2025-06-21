import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = ({ backendUrl }) => {
    const { token } = useContext(StoreContext);
    const customerId = localStorage.getItem('customerId');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [reviewFormData, setReviewFormData] = useState({});
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviews, setReviews] = useState({});

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

                        const reviewResponse = await axios.get(`${backendUrl}/api/order/reviews/${customerId}`, {
                            headers: { token }
                        });
                        const reviewData = reviewResponse.data.reduce((acc, review) => {
                            const formKey = `${review.orderId}-${review.menuItemId}`;
                            acc[formKey] = review;
                            return acc;
                        }, {});
                        setReviews(reviewData);
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

    // Initialize or update review form data
    const handleReviewChange = (orderId, menuItemId, field, value) => {
        setReviewFormData(prevData => ({
            ...prevData,
            [`${orderId}-${menuItemId}`]: {
                ...prevData[`${orderId}-${menuItemId}`],
                customerId,
                orderId,
                menuItemId,
                [field]: value
            }
        }));
    };

    // Submit review
    const handleSubmitReview = async (orderId, menuItemId) => {
        const formKey = `${orderId}-${menuItemId}`;
        const reviewData = reviewFormData[formKey];

        if (!reviewData || !reviewData.rating || !reviewData.content) {
            alert('Please fill in both rating and review content');
            return;
        }

        setSubmittingReview(true);

        try {
            await axios.post(`${backendUrl}/api/order/review`, reviewData, {
                headers: { token }
            });

            setReviews(prevReviews => ({
                ...prevReviews,
                [formKey]: reviewData
            }));

            // Update order data to mark item as reviewed
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.orderId === orderId) {
                    return {
                        ...order,
                        orderItems: order.orderItems.map(item => {
                            if (item.menuItemId === menuItemId) {
                                return { ...item, hasReviewed: true };
                            }
                            return item;
                        })
                    };
                }
                return order;
            }));

            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review, please try again');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Render star rating component
    const renderRatingStars = (rating, onChange, isReviewed) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    onClick={isReviewed ? null : () => onChange(i)}
                    style={{
                        cursor: isReviewed ? 'default' : 'pointer',
                        color: i <= rating ? '#ffc107' : '#ddd',
                        fontSize: '24px'
                    }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="order" id="order">
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
                                        order.orderItems.map((item) => {
                                            const formKey = `${order.orderId}-${item.menuItemId}`;
                                            const review = reviews[formKey];
                                            const isReviewed = !!review;

                                            return (
                                                <div key={item.orderItemId} className="order-item-card">
                                                    <img src={`/menuItem_${item.menuItemId}.png`} alt={item.MenuItem?.name || 'unknown'} />
                                                    <div className="order-item-info">
                                                        <p>Item Name: {item.MenuItem?.name || 'unknown'}</p>
                                                        <p>Quantity: {item.quantity}</p>
                                                        <p>Total Price: ${item.totalPrice}</p>

                                                        {isReviewed ? (
                                                            <div className="review-success">
                                                                <p style={{ color: 'green', fontWeight: 'bold' }}>Your Review:</p>
                                                                <div className="rating-stars">
                                                                    {renderRatingStars(review.rating, null, true)}
                                                                </div>
                                                                <p>{review.content}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="review-form">
                                                                <div className="rating-stars">
                                                                    {renderRatingStars(
                                                                        reviewFormData[formKey]?.rating || 0,
                                                                        (rating) => handleReviewChange(order.orderId, item.menuItemId, 'rating', rating),
                                                                        false
                                                                    )}
                                                                </div>
                                                                <textarea
                                                                    placeholder="Please enter your review..."
                                                                    value={reviewFormData[formKey]?.content || ''}
                                                                    onChange={(e) => handleReviewChange(order.orderId, item.menuItemId, 'content', e.target.value)}
                                                                    rows="3"
                                                                    style={{ width: '100%', margin: '10px 0' }}
                                                                />
                                                                <button
                                                                    onClick={() => handleSubmitReview(order.orderId, item.menuItemId)}
                                                                    disabled={submittingReview}
                                                                    style={{
                                                                        backgroundColor: '#4CAF50',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '8px 16px',
                                                                        cursor: 'pointer',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                >
                                                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
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