import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
    const location = useLocation();
    const order = location.state?.order;
    console.log(order);
    
  const orderDetails = {
    orderId: order.orderId,
    date: new Date().toLocaleDateString(),
    total: order.totalAmount,
    shippingAddress: `${order.shippingAddress.street,order.shippingAddress.city,order.shippingAddress.state,order.shippingAddress.zipCode}`,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 p-4">
          <h1 className="text-3xl font-bold text-white text-center">Order Confirmed!</h1>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-xl text-center mb-6">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Order Number:</p>
                <p>{orderDetails.orderId}</p>
              </div>
              <div>
                <p className="font-semibold">Order Date:</p>
                <p>{orderDetails.date}</p>
              </div>
              <div>
                <p className="font-semibold">Total:</p>
                <p>₹{orderDetails.total}</p>
              </div>
              <div>
                <p className="font-semibold">Estimated Delivery:</p>
                <p>{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Shipping Address:</p>
              <p>{orderDetails.shippingAddress}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>You will receive an order confirmation email with order details and tracking info.</li>
              <li>Once your order ships, we will send you shipping and tracking information.</li>
              <li>If you have any questions about your order, please contact our customer support.</li>
            </ul>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Link 
              to="/products"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/orders"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
            >
               Order  details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;