import { useState, useEffect } from 'react';
import { FaEllipsisV,FaComments } from 'react-icons/fa';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import PostActions from '../Post/postActions';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Post {
  _id: string;
  content: string;
  date: string;
  userId: {
    name: string;
  };
  createdAt: string;
  caption: string;
  tags: string;
  video?: string;
  images?: string[];
  liked?: string[];
  comments?: any[];
}

interface Product {
  _id: string;
  images: string[];
  name: string;
  price: number;
  description: string;
  brand: string;
  countInStock: number;
  list: boolean;
}

export default () => {
const location = useLocation();
const user = location.state
console.log('user',user);
const currentUser=useSelector((state:any)=>state.user.user)

if (!user) {
  return <div>No user data available</div>;
}
  useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, []);



  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');
  const navigate=useNavigate()

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/posts');
      const filterData=response.data.data.filter((val:any)=>val.userId._id===user._id)
      setPosts(filterData);

    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/products');
      const filterData=response.data.data.filter((val:any)=>val.userId._id===user._id)
      setProducts(filterData);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);
  // const [selectedReason, setSelectedReason] = useState('');

  const handleReportClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChatClick = async() => {
    try{
        const data = {
          senderId: currentUser._id,
          receiverId: user._id,
        };
        console.log(data,',.sdbjaks');
        
  
        const response = await axiosInstance.post(
          "/api/auth/createConverstation",
          data
        );
        if (response.status) {
         
  
          toast.success("conversation Created");
          navigate(`/chat`);
        }
      } catch (error) {}


  };
  

  const handleSelectReason = async (reason: string) => {
    // setSelectedReason(reason);
    setShowDropdown(false);

    try {
      const response = await axiosInstance.post('/api/auth/report', {
        reportedPostId: user._id,
        reason: reason,
        type: 'creative',
      });

      if (response.data.status) {
        toast.success('Report submitted successfully');
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('An error occurred while submitting the report');
    }

    console.log(`User reported for: ${reason}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full">
      <div className="relative h-64">
        <img src='/images/profile.avif' alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute bottom-4 left-4 flex items-end">
          <img src={`https://hasth.mooo.com/src/uploads/${user.image}`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />
          <div className="ml-4 text-white">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sm">{user.specification}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-end relative">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300" onClick={handleReportClick}>
            Report User
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              <ul className="py-2">
                <li
                  onClick={() => handleSelectReason('Spam')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Spam
                </li>
                <li
                  onClick={() => handleSelectReason('Harassment')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Harassment
                </li>
                <li
                  onClick={() => handleSelectReason('Inappropriate Content')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Inappropriate Content
                </li>
                <li
                  onClick={() => handleSelectReason('Other')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Other
                </li>
              </ul>
            </div>
          )}
           <button onClick={handleChatClick} className="ms-5 text-blue-500 hover:text-blue-700 text-2xl">
            <FaComments />
          </button>
        </div>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600 mt-2">Skills: {user.skills}</p>
        <p className="text-gray-600">Education: {user.education}</p>

        <div className="flex justify-around mt-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{posts.length}</h2>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{products.length}</h2>
            <p className="text-gray-600">Products</p>
          </div>
        </div>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 ${
            activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 ${
            activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Products
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'posts' ? (
          <div>
            {posts.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No posts available.</p>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6 relative">
                  <div className="absolute top-4 right-4">
                    <button  className="text-gray-500 hover:text-gray-700">
                      <FaEllipsisV />
                    </button>
                  </div>
                  <div className="flex items-center mb-6">
                    <img
                      src="images/profile.png"
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{post.userId.name}</h3>
                      <span className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="mb-6 text-gray-700 leading-relaxed">{post.caption}</p>
                  {post.tags && (
                    <div className="mb-6">
                      {post.tags.split(',').map((tag, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-full grid grid-cols-1 gap-4 mb-6">
                    {post.video && (
                      <div className="col-span-1">
                        <video
                          src={`https://hasth.mooo.com/src/uploads/${post.video}`}
                          controls
                          className="w-full h-72 object-cover rounded-lg mb-4"
                        />
                      </div>
                    )}
                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-4 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((img, index) => (
                          <img
                            key={index}
                            src={`https://hasth.mooo.com/src/uploads/${img}`}
                            alt={`Post Image ${index + 1}`}
                            className="w-full h-72 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <PostActions
                    userId={user._id}
                    post={post}
                    initialLikesCount={post.liked?.length || 0}
                    initialCommentsCount={post.comments?.length || 0}
                    isAuthor
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 relative">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm mt-2">Brand: {product.brand}</p>
                  <p className="text-gray-500 text-sm">In Stock: {product.countInStock}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                There are no products
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
