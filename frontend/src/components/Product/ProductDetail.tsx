import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
// import ImageZoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface Review {
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewdescription: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  collab?: {
    _id: string;
    name: string;
  };
  images: string[];
  brand: string;
  countInStock: number;
  review: Review[];
  isFeatured: boolean;
  price: number;
  popularity: number;
  list: boolean;
}

const ProductDetail: React.FC = () => {
  const location = useLocation();
  const product = (location.state as { product: Product })?.product;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    toast.success('Product added to cart');
  };

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (!product) {
    return <div className="text-center mt-8">Product not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
            
 
  <div className="flex overflow-x-auto grid-flow-row">
    {product.images.map((image, index) => (
      <img
        key={index}
        src={`http://localhost:8080/src/uploads/${image}`}
        alt={`${product.name} - ${index + 1}`}
        className={`w-1/2 h-1/2 object-cover cursor-pointer rounded-md transition duration-300 ${
          index === currentImageIndex ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
        }`}
        onClick={() => setCurrentImageIndex(index)}
      />
    ))}
 
</div>
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-red-600">₹{product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500">({product.countInStock} in stock)</span>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-1">Brand: <span className="text-gray-700">{product.brand}</span></p>
                <p className="text-sm font-medium text-gray-500 mb-1">Popularity: <span className="text-gray-700">{product.popularity}</span></p>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Rating:</span>
                  <div className="flex">{renderStars(parseFloat(calculateAverageRating(product.review)))}</div>
                  <span className="ml-2 text-sm text-gray-500">({product.review.length} reviews)</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
              >
                Add to Cart
              </button>
              {product.collab && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">Collaboration</h2>
                  <p className="text-sm text-gray-600">
                    In collaboration with <span className="font-medium text-blue-600">{product.collab.name}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

       
        <div className="mt-12 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
          <div className="flex items-center mb-6">
            <div className="text-4xl font-bold text-yellow-400 mr-4">{calculateAverageRating(product.review)}</div>
            <div>
              <div className="flex mb-1">{renderStars(parseFloat(calculateAverageRating(product.review)))}</div>
              <p className="text-sm text-gray-500">Based on {product.review.length} reviews</p>
            </div>
          </div>
          {product.review.length > 0 ? (
            product.review.map((review, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">{review.user.name}</p>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-600">{review.reviewdescription}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;