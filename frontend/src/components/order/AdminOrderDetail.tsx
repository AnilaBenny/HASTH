import ReactDOM from "react-dom";

const AdminOrderDetail = ({ isOpen, onClose, order }:any) => {
  if (!isOpen || !order) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Customer Information</h3>
            <p><span className="font-medium">Name:</span> {order.userId.name}</p>
            <p><span className="font-medium">Email:</span> {order.userId.email}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Order Information</h3>
            <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.orderStatus}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Items</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {order.items.map((item:any, index:any) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span>{item.product.name} x {item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right">
          <p className="text-lg"><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminOrderDetail;