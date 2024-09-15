import  { useState, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import PostActions from '../Post/postActions';
import { useSelector } from 'react-redux';
import EditModal from '../Post/EditModal';

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


interface User {
  _id: string;
  image: string;
  name: string;
  specification: string;
  email: string;
  skills: string[];
  education: string;
}


interface Product {
  _id: string;
  images: string[];
  name: string;
  price: number;
  description: string;
  brand: string;
  countInStock: number;
  list:boolean
}

export default() => {
  useEffect(() => {
    fetchPosts();
    fetchProducts();
  }, []);
  const user:User|null = useSelector((state: any) => state.user.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts');
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Post | Product | null>(null);
  const [type,setType]=useState('');
  const navigate = useNavigate();



  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/posts');
      const userPosts = response.data.data.filter((post:any) => post.userId ===user?._id);
      setPosts(userPosts);
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/products');
      const userProducts = response.data.data.filter((product:any) => product.userId ===user?._id);
      setProducts(userProducts);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const handleEdit = (item: Post | Product, type: 'post' | 'product') => {
    console.log('Editing Item:', item);
    console.log('Type:', type);
    setEditingItem(item);
    setEditModalOpen(true);
    setType(type);
    setShowOptions(null);
  };
  

const handleShowOptions = (postId: string) => {
  setShowOptions(prevId => (prevId === postId ? null : postId));
};


  const handleDelete = async (id: string, type: 'post' | 'product') => {
    try {
      
      if (type === 'post') {
        await axiosInstance.delete(`/api/auth/deleteIdea/${id}`);
        setPosts(posts.filter(post => post._id !== id));
      } else {
        const response=await axiosInstance.patch(`/api/auth/deleteProduct/${id}`);
        console.log(response);
        
        setProducts(products.filter(product => product.list =!product.list));
      }
    } catch (error) {
      console.log(`Error deleting ${type}:`, error);
    }
    setShowOptions(null);
  };

  const handleSaveEdit = async (updatedItem: any,type:any) => {
    try {
      if (type === 'post') {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedItem._id ? updatedItem : post
          )
        );
      } else {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedItem._id ? updatedItem : product
          )
        );
      }
      
      setEditModalOpen(false);
    } catch (error) {
      console.log('Error updating item:', error);
    }
  };
 

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full">
      <div className="relative h-64">
        <img src='/images/profile.avif' alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute bottom-4 left-4 flex items-end">
          <img src={`http://localhost:8080/src/uploads/${user?.image}`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />
          <div className="ml-4 text-white">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-sm">{user?.specification}</p>
          </div>
        </div>
        <button
          onClick={handleEditProfile}
          className="absolute top-4 right-4 bg-white text-blue-500 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
        >
          Edit Profile
        </button>
      </div>

      <div className="p-6">
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-gray-600 mt-2">Skills: {user?.skills}</p>
        <p className="text-gray-600">Education: {user?.education}</p>
        
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
        <button onClick={() => handleShowOptions(post._id)} className="text-gray-500 hover:text-gray-700">
          <FaEllipsisV />
        </button>
        {showOptions === post._id && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button onClick={() => handleEdit(post,'post')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaEdit className="inline mr-2" /> Edit
            </button>
            <button onClick={() => handleDelete(post._id, 'post')} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <FaTrash className="inline mr-2" /> Delete
            </button>
          </div>
        )}
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
              src={`http://localhost:8080/src/uploads/${post.video}`} 
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
                src={`http://localhost:8080/src/uploads/${img}`}
                alt={`Post Image ${index + 1}`}
                className="w-full h-72 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
      <PostActions 
        userId={user?._id||''} 
        post={post} 
        initialLikesCount={post.liked?.length || 0} 
        initialCommentsCount={post.comments?.length || 0} 
        isAuthor
      />
   
  </div>
)))}
</div>
): (
          <div className="grid grid-cols-2 gap-4">
            {products.length > 0  ? (
              products.map(product => (
                <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 relative">
                  <div className="absolute top-2 right-2">
                    <button onClick={() => handleShowOptions(product._id)} className="text-gray-500 hover:text-gray-700">
                      <FaEllipsisV />
                    </button>
                    {showOptions === product._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button onClick={() => handleEdit(product,'product')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaEdit className="inline mr-2" /> Edit
                        </button>
                        <button onClick={() => handleDelete(product._id, 'product')} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <FaTrash className="inline mr-2" /> {product.list?'unlist':'list'}
                        </button>
                      </div>
                    )}
                  </div>
                  {
                  product.list ? (
                      <p className='bg-green-600 text-center w-12 ps-2 pe-2 rounded-2xl mb-2'>listed</p>
                  ) : (
                      <p className='text-red-600'>unlisted</p>
                  )}

                  {product.images && product.images.length > 0 && (
                    <img
                      src={`http://localhost:8080/src/uploads/${product.images[0]}`}
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
              <button onClick={() => navigate('/products')} className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                Add Products
              </button>
            )}
          </div>
        )}
      </div>
      
      {editingItem && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          data={editingItem}
          type={type}
        />
      )}
    </div>
  );
};

