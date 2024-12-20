import React, {useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import HandlePayPal from './HandlePayPal';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useApiService from '../../Services/Apicalls';
import { CreditCard, Banknote, Truck } from 'lucide-react';
import { updateTotalPrice } from '../../store/slices/cartSlice';

const stripePromise = loadStripe('pk_test_51PrKKwJKak3nsLbf6XEzehMZVJUSBQ4E9QWdUPTNFxGj1vveGo0NHx95qmJFcy5kyQ8Za7wOt6wLO9o4UjK2dex100vPyO4esO');
declare global {
  interface Window {
    Razorpay: any;
  }
}
export default () => {
  const PayPalLogo = ({ className }:any) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.1 6.27c.3 1.97-.6 3.34-2.04 4.5-1.3 1.04-2.97 1.47-4.61 1.47h-.38c-.31 0-.59.22-.66.53l-.54 3.41-.16.97c-.06.37-.39.64-.76.64H8.27c-.26 0-.45-.25-.41-.51l1.42-9.03c.06-.37.39-.64.76-.64h4.8c1.24 0 2.31.27 3.1.82.92.64 1.44 1.56 1.6 2.84zM22.54 3.07C23.59 4.67 24 6.7 23.61 9.02c-.62 3.67-3.23 5.43-7.03 5.43h-.57c-.41 0-.78.3-.85.7l-.67 4.23-.19 1.21c-.06.37-.39.64-.76.64H9.94c-.26 0-.45-.25-.41-.51L11.42 5c.12-.75.76-1.3 1.52-1.3h6.91c1.03 0 1.92.23 2.69.71z" />
    </svg>
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: any) => state.cart.cart);
  const user = useSelector((state: any) => state.user.user);
  const service=useApiService();
  const [supercoinsUsed, setSupercoinsUsed] = useState(false);
  const paymentMethods = [
    { name: 'Stripe', icon: CreditCard },
    { name: 'PayPal', icon: PayPalLogo },
    { name: 'Razorpay', icon: Banknote },
    { name: 'COD', icon: Truck },
  ];
  //@ts-ignore
  const [originalTotalPrice, setOriginalTotalPrice] = useState(cart.totalPrice);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    paymentObject.on('payment.failed', async function (response: any) {
      console.error("Payment failed:", response);
      await service.handleFailurePayment(cart);
    });
    paymentObject.open();
  };
  const handleCod=async()=>{
    try{
    const res = await axiosInstance.post('/api/auth/order', { cart ,paymentMethod:'COD'});
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
  }

  const handleSubmit = async () => {

    if (paymentMethod === 'Razorpay') {
       handleRazorpayPayment();
    }else if (paymentMethod === 'Stripe') {
      setIsModalOpen(true);
    }else if(paymentMethod === 'COD'){
      handleCod()
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
  const handleSupercoinUsage = () => {
    if (!supercoinsUsed && user?.supercoin?.balance > 0) {
      const newTotal = Math.max(0, originalTotalPrice - user.supercoin.balance);
      dispatch(updateTotalPrice(newTotal));
      setSupercoinsUsed(true);
      localStorage.setItem('supercoinsUsed', 'true');
    }
  };
  const resetSupercoinUsage = () => {
    setSupercoinsUsed(false);
    dispatch(updateTotalPrice(originalTotalPrice));
    localStorage.removeItem('supercoinsUsed');
  };
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
                <p className="text-gray-600">{user.address[0].street}</p>
                <p className="text-gray-600">{user.address[0].city}, {user.address[0].state} {user.address[0].zipCode}</p>
                
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
            {supercoinsUsed&&<div className="flex justify-between items-center mb-2 text-gray-700">
              <span>super coin used</span>
              <span className="font-semibold">{user.supercoin.balance} SC</span>
              </div>
            }
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
        <p className="text-lg font-semibold">
          You have {user?.supercoin?.balance} supercoins.
        </p>
        {!supercoinsUsed && user?.supercoin?.balance > 0 && (
          <button
            onClick={handleSupercoinUsage}
            className="text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none"
          >
            Would you like to use them?
          </button>
        )}
        {supercoinsUsed && (
          <>
          <p className="text-green-600 font-medium mt-1">
            Supercoins applied to your order!
          </p>         <button
                onClick={resetSupercoinUsage}
                className="text-red-600 hover:text-red-800 font-medium underline focus:outline-none ml-2"
              >
                Remove supercoin discount
              </button>
              </>
        )}
      

          <label className="block text-gray-700 mb-2">Select Payment Method</label>
          <div className="flex flex-wrap gap-4">
          {paymentMethods.map((method) => (
          <label
            key={method.name}
            className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              paymentMethod === method.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="radio"
              value={method.name}
              checked={paymentMethod === method.name}
              onChange={() => setPaymentMethod(method.name)}
              className="sr-only"
            />
            <method.icon className={`w-6 h-6 mr-2 ${
              paymentMethod === method.name ? 'text-blue-500' : 'text-gray-500'
            }`} />
            <span className={`font-medium ${
              paymentMethod === method.name ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {method.name}
            </span>
          </label>
        ))}
            {
              paymentMethod==='PayPal'&&(
                <HandlePayPal cart={cart}/>
              )
            }
{paymentMethod === 'Stripe' && isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stripe Payment</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
      <Elements stripe={stripePromise}>
        <PaymentForm
          cart={cart}
          user={user}
          dispatch={dispatch}
          navigate={navigate}
          closeModal={() => setIsModalOpen(false)}
        />
      </Elements>
    </div>
  </div>
)}


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

const PaymentForm = ({ cart, dispatch, navigate }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      alert('Stripe has not loaded. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert('Card element not found. Please try again.');
      return;
    }

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        alert(paymentMethodError.message);
        return;
      }

      const response = await axiosInstance.post('/api/auth/order/createOnlineOrder', {
        amount: cart.totalPrice,
        currency: 'USD',
        paymentMethod: 'Stripe',
        paymentMethodId: paymentMethod.id,
      });
console.log(response,'....stripjb');
let paymentIntent=response.data.paymentIntent;
if (paymentIntent.status === 'requires_confirmation' || paymentIntent.status === 'requires_action') {
      const { error: confirmError } = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }
    }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
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
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error during payment processing:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  return (
    <form onSubmit={handleStripePayment}>
      <div className="mt-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded mt-4">
        Pay with Stripe
      </button>
    </form>
  );
};

