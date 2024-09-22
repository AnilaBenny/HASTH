import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useApiService from '../../Services/Apicalls';
import { toast } from 'react-toastify';

interface Review {
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewdescription: string;
}



const ProductDetail: React.FC = () => {
  const location = useLocation();
  
  const [product,setProduct] =useState(location.state?.product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cart = useSelector((state: any) => state.cart.cart);
  const user = useSelector((state: any) => state.user.user);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editedRating, setEditedRating] = useState<number>(0);
  const [editedDescription, setEditedDescription] = useState<string>('');
  const { handleAddToCart,handleReviewEdit } = useApiService();
  const handleEditClick = (review: Review) => {
    setEditingReview(review.user._id);
    setEditedRating(review.rating);
    setEditedDescription(review.reviewdescription);
  };

  const handleSubmitEdit = async(reviewId: string) => {
    const response=await handleReviewEdit(product._id,reviewId, editedRating, editedDescription);
    setProduct(response)
    setEditingReview(null);
    toast.success('Review Updated');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
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
    return <div className="text-center mt-8 text-gray-600 text-xl">Product not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image:any, index:any) => (
                  <img
                    key={index}
                    src={`https://hasth.mooo.com/src/uploads/${image}`}
                    alt={`${product.name} - ${index + 1}`}
                    className={`w-full h-48 object-cover cursor-pointer rounded-lg transition duration-300 ${
                      index === currentImageIndex ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
                <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-red-600">₹{product.price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500">({product.countInStock} in stock)</span>
                </div>
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-1">Popularity: <span className="text-gray-700">{product.popularity}</span></p>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">Rating:</span>
                    <div className="flex">{renderStars(parseFloat(calculateAverageRating(product.review)))}</div>
                    <span className="ml-2 text-sm text-gray-500">({product.review.length} reviews)</span>
                  </div>
                </div>
              </div>
              {(product.userId._id !== user._id && product.collab?._id !== user._id) && (
                <button
                  onClick={() => handleAddToCart(product._id, cart, user._id)}
                  className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-lg"
                >
                  Add to Cart
                </button>
              )}
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

        <div className="mt-12 bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
          <div className="flex items-center mb-8">
            <div className="text-5xl font-bold text-yellow-400 mr-6">{calculateAverageRating(product.review)}</div>
            <div>
              <div className="flex mb-2">{renderStars(parseFloat(calculateAverageRating(product.review)))}</div>
              <p className="text-sm text-gray-500">Based on {product.review.length} reviews</p>
            </div>
          </div>
          {product.review && product.review.length > 0 ? (
          product.review.map((review:any, index:any) => (
            <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-800 text-lg">{review.user?.name || 'Anonymous'}</p>
                {review.user && user && review.user._id === user._id && (
                  editingReview === review.user._id ? (
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleSubmitEdit(review._id)}
                        className="text-green-600 hover:text-green-800 transition duration-300"
                      >
                        Submit
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-800 transition duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(review)}
                      className="text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      Edit
                    </button>
                  )
                )}
              </div>
              {editingReview === review.user._id ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="mr-2">Rating:</span>
                    <select 
                      value={editedRating} 
                      onChange={(e) => setEditedRating(Number(e.target.value))}
                      className="border rounded p-1"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
              ) : (
                <>
                  <div className="flex mb-3">{renderStars(review.rating)}</div>
                  <p className="text-gray-600 text-lg">{review.reviewdescription}</p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;