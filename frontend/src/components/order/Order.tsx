// OrderPage.js
import React, { useState, useEffect } from 'react';
import './Order.css';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useSelector } from 'react-redux';

export default () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productOrders, setProductOrders] = useState([]);
  const user=useSelector((state:any)=>state.user.user)

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await axiosInstance.get(`/api/auth/allorders/${user._id}`)
    setOrders(response.data.data);
  };

  const handleOrderClick = async (order:any) => {
    setSelectedOrder(order);
    const response = await fetch(`/api/auth/productorders`);
    const data = await response.json();
    setProductOrders(data);
  };

  return (
    <div className="order-page">
      <h1>Your Orders</h1>
      <div className="order-container">
        <div className="order-list">
          <h2>Order List</h2>
          <ul>
            {orders.map((order) => (
              <li 
                key={order.id} 
                onClick={() => handleOrderClick(order)}
                className={selectedOrder && selectedOrder.id === order.id ? 'selected' : ''}
              >
                <span className="order-id">Order #{order.orderId}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-total"> ₹{order.totalAmount}</span>
              </li>
            ))}
          </ul>
        </div>
        {selectedOrder && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            </div>
            <h3>Product Orders</h3>
            <ul className="product-orders">
              {productOrders.map((po) => (
                <li key={po.id}>
                  <span>{po.productName}</span>
                  <span>Quantity: {po.quantity}</span>
                  <span> ₹{po.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}