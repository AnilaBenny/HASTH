import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';

export default () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: any) => state.cart.cart);
  const user = useSelector((state: any) => state.user.user);

  const handleRemoveItem = async (itemId: string) => {
    const confirmed = window.confirm("Are you sure you want to remove this item from the cart?");
    
    if (confirmed) {
      try {
        const response = await axiosInstance.post('/api/auth/removecartitem', { itemId,userId:user._id });
  
        if (response.data.status) {  
          dispatch(removeFromCart(itemId));
          toast.success('Item removed successfully.');
        } else {
          alert('Failed to remove item.');
        }
      } catch (error) {
        console.error('Error removing item:', error);
        alert('An error occurred while trying to remove the item.');
      }
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };
 

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center mt-16">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>
        <img
          src="/images/cartEmpty.jpeg"
          alt="Empty Cart"
          className="mx-auto mb-6 rounded-lg shadow-md"
        />
        <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-blue-600 hover:text-blue-800 text-lg font-semibold underline transition duration-300">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item: any) => (
            <div key={item._id} className="flex items-center border-b border-gray-200 py-6 last:border-b-0">
              <img 
                src={`http://localhost:8080/src/uploads/${item.productId.images[0]}`} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-md shadow-sm mr-6" 
              />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
                <p className="text-gray-600 text-lg mb-3">${item.price.toFixed(2)}</p>
                <div className="flex items-center">
                  <label htmlFor={`quantity-${item._id}`} className="mr-3 text-gray-700">Quantity:</label>
                  <select
                    id={`quantity-${item._id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                    className="border rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(5)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="text-red-500 hover:text-red-700 transition duration-300 ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
            <div className="flex justify-between mb-4 text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-700">
              <span>Shipping:</span>
              <span className="font-semibold">Free</span>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between font-semibold text-xl mt-4 text-gray-800">
              <span>Total:</span>
              <span>₹{cart.totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-400 text-gray-900 py-3 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 mt-6 font-semibold text-lg"
            onClick={()=>navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};