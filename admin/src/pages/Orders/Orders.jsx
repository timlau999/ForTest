import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.get(
        url + `/api/order/status?orderId=${orderId}&status=${event.target.value}`,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => {
            const totalUsedPoints = (order.customer_points_usages || []).reduce(
              (sum, usage) => sum + (usage.usedPoints || 0),
              0
            );
            return (
              <div key={order.orderId} className="order-item">
                <div className="order-item-header">
                  <p>Order ID: {order.orderId}</p>
                  <p>Order Date: {order.orderDate}</p>
                </div>
                <div className="order-item-details">
                  <p>Order Status:                      
                    <select
                    className="order-status-select"
                    onChange={(event) => statusHandler(event, order.orderId)}
                    value={order.orderStatus}
                  >
                    <option value="MenuItem Processing">MenuItem Processing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Order Completed">Order Completed</option>
                    </select>
                  </p>
                  <p>Total Amount: ${order.totalAmount}</p>
                  <p>Payment Status: {order.paymentStatus}</p>
                  <p>Points Used: {totalUsedPoints} pts</p>
                </div>
                <div className="order-item-items">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item.orderItemId} className="order-item-info">
                        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                          Item Name: {item.MenuItem?.name || "unknown"}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Unit Price: ${item.unitPrice}</p>
                        <p>Total Price: ${item.totalPrice}</p>
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
        <p style={{ fontSize: "18px", color: "#747474" }}>No orders now</p>
      )}
    </div>
  );
};

export default Orders;