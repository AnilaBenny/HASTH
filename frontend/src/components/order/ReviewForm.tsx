
import  { useState } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';

const ReviewForm = ({ orderId ,userId,setOrder}:any) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response=await axiosInstance.post(`/api/auth/review`, {
        orderId,
        rating,
        comment,
        userId
      });

      
      if(response.data.status)
     { toast.success('your valuable review is added')
      setComment('');
      setRating(0)
      setOrder(response.data.data)
      }
      
      
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
      <div className="mb-4">
        <label className="block mb-2">Rating:</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          rows={4}
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;