import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import HandlePayPal from './HandlePayPal';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PrKKwJKak3nsLbf6XEzehMZVJUSBQ4E9QWdUPTNFxGj1vveGo0NHx95qmJFcy5kyQ8Za7wOt6wLO9o4UjK2dex100vPyO4esO');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: any) => state.cart.cart);
  const user = useSelector((state: any) => state.user.user);

  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


 

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const orderData = await axiosInstance.post('/api/auth/order/createOnlineOrder', {
      amount: cart.totalPrice,
      currency: 'INR',
      receipt: `receipt_order_${Math.random() * 1000}`,
      paymentMethod:'Razorpay'
    });

    const { amount, id: order_id, currency } = orderData.data;
   
    const options = {
      key: "rzp_test_2sQVid1X3uLewM",
      amount: amount,
      currency: currency,
      name: "Hasth",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response:any) {
        console.log(response);
        
        try{
        const paymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id:order_id,
          razorpay_signature: response.razorpay_signature,
        };
        const res = await axiosInstance.post('/api/auth/order', { cart,paymentData ,paymentMethod:'Razorpay'});
        console.log(res);
        
        

          if (res.status===200) {
            console.log("Order created successfully:");
            dispatch(clearCart());
          
            navigate('/order-confirmation', { state: { order:res?.data.data } });
          } else {
            console.error("Order creation failed");
            alert("Order creation failed. Please try again.");
          }
        } catch (error) {
          console.error("Error during payment processing:", error);
          alert("An error occurred while processing your payment. Please try again.");
        }
        
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleStripePayment = async () => {
  
  
    if (!stripe || !elements) {
      alert('Stripe has not loaded. Please try again.');
      return;
    }
  
    // Get the card element from Stripe Elements
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert('Card element not found. Please try again.');
      return;
    }
  
    try {
      console.log(cardElement);
      
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (paymentMethodError) {
        
          alert(paymentMethodError.message);
        
        return;
      }
  
      // Send the payment method to your server to create a payment intent
      const response = await axiosInstance.post('/api/auth/order/createOnlineOrder', {
        amount: cart.totalPrice * 100, // Amount in cents or smallest currency unit
        currency: 'INR',
        paymentMethod: 'Stripe',
        paymentMethodId: paymentMethod.id, 
      });
  
      // Confirm the payment on the client-side with the client secret
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );
  
      if (confirmError) {
        throw new Error(confirmError.message);
      }
  
      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        throw new Error('Payment failed');
      }
  
      // Finalize the order and clear the cart
      const orderResponse = await axiosInstance.post('/api/auth/order', {
        cart,
        paymentData: { id: paymentIntent.id },
        paymentMethod: 'Stripe',
      });
  
      if (orderResponse.status === 200) {
        dispatch(clearCart());
        navigate('/order-confirmation', { state: { order: orderResponse.data.data } });
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };
  
  
  


  const handleSubmit = async () => {

    if (paymentMethod === 'Razorpay') {
       handleRazorpayPayment();
    }else if(paymentMethod==='Stripe'){
      handleStripePayment();
    }
  };
  

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Checkout</h1>
        <p className="text-xl text-gray-600">Your cart is empty. Please add some items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Shipping Information</h2>
          {user && user.address && (
            <div className="mb-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Shipping Address</h3>
                <p className="text-gray-600">{user.address.street}</p>
                <p className="text-gray-600">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                
                <label className="flex items-center mt-4 text-gray-700">
                  <input
                    type="checkbox"
                    checked={useExistingAddress}
                    onChange={() => setUseExistingAddress(!useExistingAddress)}
                    className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                  />
                  Use existing address
                </label>
              </div>
            </div>
          )}  
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Order Summary</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {cart.items.map((item: any) => (
              <div key={item._id} className="flex justify-between items-center mb-2 text-gray-700">
                <span>{item.productId.name} x {item.quantity}</span>
                <span className="font-semibold">₹{(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-300 my-4"></div>
            <div className="flex justify-between items-center font-semibold text-lg text-gray-800">
              <span>Total:</span>
              <span>₹{cart.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Payment Method</h2>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Payment Method</label>
          <div className="flex flex-wrap gap-4">
            {['Stripe', 'PayPal', 'Razorpay', 'COD'].map((method) => (
              <label key={method} className="inline-flex items-center">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{method}</span>
              </label>
            ))}
            {
              paymentMethod==='PayPal'&&(
                <HandlePayPal cart={cart}/>
              )
            }
            <div className="mt-4">
            {paymentMethod === 'Stripe' && (<CardElement />)}
</div>

          </div>
        </div>

        <button
          type="submit"
          disabled={!paymentMethod}
          onClick={handleSubmit}
          className=" bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 text-lg font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
export default () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);