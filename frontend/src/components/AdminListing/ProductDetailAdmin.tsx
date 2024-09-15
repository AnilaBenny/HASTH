import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    price: number;
    images: string[];
    isActive: boolean;
  } | null;
}

const ProductModal: React.FC<ModalProps> = ({ isOpen, onClose, product }:any) => {
  if (!isOpen || !product) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
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
        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:8080/src/uploads/${product.images[0]}`}
            alt={product.name}
            className="w-full h-48 object-cover mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-bold mb-2">${product.price.toFixed(2)}</p>
          <p className={`text-sm ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
