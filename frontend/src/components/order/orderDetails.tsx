import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import { FaShoppingCart, FaBox, FaShippingFast, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import Invoice from '../Invoice/Invoice';
import { toast } from 'react-toastify';
import useApiService from '../../Services/Apicalls';

const OrderStages = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];


const StageIcon = ({ stage, isActive, isCompleted }) => {
  
  const icons = {
    Pending: FaClock,
    Processing: FaShoppingCart,
    Shipped: FaShippingFast,
    Delivered: FaCheckCircle,
    Cancelled: FaBan,
  };
  const Icon = icons[stage];

  
  return (
    <div className={`flex flex-col items-center ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-400'} transition-all duration-300 ease-in-out`}>
      <div className={`rounded-full p-3 ${isActive ? 'bg-blue-100 scale-110' : isCompleted ? 'bg-green-100' : 'bg-gray-200'} transition-all duration-300 ease-in-out`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="mt-2 text-xs font-medium">{stage}</p>
    </div>
  );
};

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [isTrue, setIsTrue] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showCancellationRequest, setShowCancellationRequest] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const location = useLocation();
  const {handleRazorPayment}=useApiService()

  useEffect(() => {
    if (location.state) {
      setOrder(location.state.order);
      setIsTrue(location.state.isTrue);
      setNewStatus(location.state.order.orderStatus);
    }
  }, [location.state]);

  const handleStatusUpdate = async() => {
    console.log(`Order status updated to: ${newStatus}`);
    const response=await axiosInstance.patch('/api/auth/updateOrderStatus',{OrderId:order?._id,newStatus})
    setOrder(response.data.data)
    toast.success('status update successfully')
  };

  const handleCancellationRequest = async() => {

    console.log(`Cancellation requested for order ${order.orderId}`);
    const response=await axiosInstance.patch('/api/auth/cancelOrder',{OrderId:order?._id})
    setOrder(response.data.data)
    setShowCancellationRequest(true);
    setShowCancellationModal(false);
  };

  if (!order) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const currentStageIndex = OrderStages.indexOf(order.orderStatus);
  const filteredOrderStages = OrderStages.filter((stage) => {
    const currentStatusIndex = OrderStages.indexOf(order.orderStatus);
    const stageIndex = OrderStages.indexOf(stage);
    return stageIndex > currentStatusIndex;
  });
 
 const handlePayment= async() => {
  const res:any=await handleRazorPayment(order, order?.userId);
  console.log(res,'gsdhg');

  if(res){
    toast.success('payment done')}
      
  setOrder((prevOrder: any) => ({
    ...prevOrder,
    paymentStatus: 'Paid',
  }));
  }

  
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-3xl">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-white tracking-wide">Order #{order.orderId}</h2>
            <div className='flex'>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md me-5
                ${order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-900' :
                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-900' :
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-900' :
                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-900' :
                'bg-gray-100 text-gray-900'
              }`}
            >
              {order.orderStatus}
            </span>
            {!isTrue && order.orderStatus==='Delivered'&&<Invoice invoiceData={order}/>}
            </div>
          </div>

        </div>

          <div className="p-6 md:p-10">
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                {OrderStages.map((stage, index) => (
                  <StageIcon
                    key={stage}
                    stage={stage}
                    isActive={index === currentStageIndex}
                    isCompleted={index < currentStageIndex}
                  />
                ))}
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(currentStageIndex / (OrderStages.length - 1)) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                  ></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <p className="text-sm font-medium text-gray-500">Payment Details</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{order.paymentMethod} - {order.paymentStatus}</p>
                {!isTrue&&order.paymentStatus!=='Paid' &&  
                  <button 
                    onClick={handlePayment} 
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
                  >
                    Complete your payment
                  </button>
                }

              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">₹{order.totalAmount}</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ordered Items</h3>
              <ul className="divide-y divide-gray-200">
                {order.items.map((product) => (
                  <li key={product.product._id} className="py-6 flex items-center hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                    <img 
                      src={`http://localhost:8080/src/uploads/${product.product.images[0]}` || 'https://via.placeholder.com/100'}
                      alt={product.product.name}
                      className="h-24 w-24 rounded-md object-cover mr-6 shadow-md"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">{product.product.name}</p>
                      <p className="text-md text-gray-500 mt-1">Quantity: {product.quantity}</p>
                      <p className="text-lg font-medium text-blue-600 mt-1">₹{product.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
       
           
            
       
         
            
            {isTrue && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h3>
                <div className="flex items-center space-x-4">

                  {order.paymentStatus==='Paid'?(
                    <><select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full sm:w-[200px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{order.orderStatus}</option>
                    {filteredOrderStages.filter((stage) => !(order.orderStatus === 'Delivered' && stage === 'Cancelled'))
                    .map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                                  <button
                                  onClick={handleStatusUpdate}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                  Update Status
                                </button></>):<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-yellow-800">
                  Payment Pending
                </span>}


                </div>
              </div>
            )}
            
            {!isTrue && order.orderStatus === 'Processing'&& !showCancellationRequest&& (
              <div className="mt-10">
                <button
                  onClick={() => setShowCancellationModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel your Order
                </button>
              </div>
            )}

            {showCancellationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
                  <p>Are you sure you want to Cancel this order?</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setShowCancellationModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      No, keep order
                    </button>
                    <button
                      onClick={handleCancellationRequest}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Yes, cancel order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showCancellationRequest && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-md animate-fade-in-down">
                <p className="text-yellow-700">Your order is Cancelled</p>
              </div>
            )}

            {!isTrue && order.orderStatus === 'Delivered'&&!order.reviewed && (
              <div className="mt-10">
                <ReviewForm orderId={order._id} userId={order.userId} setOrder={setOrder} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;