import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const user = useSelector((state:any) => state.user.user);
  const [customer, setCustomer] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      fetchOrdersByCustomer();
    } else {
      fetchOrders();
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/admin/allorders`);
      const filterData = response.data.data.orders.filter((order: any) => 
        order.items.some((item: any) => 
          item.product.userId !== user._id && item.product.collab !== user._id
        )
      );
      console.log(filterData);
      setOrders(filterData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  const fetchOrdersByCustomer = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/admin/allorders`);
      const filterData = response.data.data.orders.filter((order: any) => 
        order.items.some((item: any) => 
          item.product.userId === user._id || item.product.collab === user._id
        )
      );
      setOrders(filterData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  



  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

  const ViewDetails = (order:any) => {
    if(customer){
      navigate('/orderDetail', { state: { isTrue: true, order } });
    }else{
      navigate('/orderDetail', { state: { isTrue: false, order } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between items-center mb-6'>
      {customer&&<button
         onClick={()=>navigate('/viewAnalytics',{state:orders})}
         className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
       >
         view Analytics
       </button>}
        <h1 className="text-3xl font-bold text-gray-800">{customer ? 'Your  Customer Orders' : 'Your Orders'}</h1>

        <button
          onClick={() => setCustomer(!customer)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          {customer ? 'See Your Orders' : 'Orders By Your Customer'}
        </button>
   
      </div>



      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Order ID', 'Date', 'Total', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order:any) => (
              <tr key={order._id} className="hover:bg-gray-50 transition duration-150">
               {order.paymentStatus==='Paid'? <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderId}</td>:<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-yellow-800">
                  Payment Pending
                </span>
              </td>
              }
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                order.orderStatus === 'Processing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.orderStatus === 'Shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : order.orderStatus === 'Delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {order?.orderStatus}
            </span>

                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => ViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900 transition duration-150"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          className="flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default OrderPage;