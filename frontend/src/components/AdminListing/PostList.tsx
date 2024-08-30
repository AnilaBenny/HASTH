import { useEffect, useState } from "react";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  caption: string;
  images: string[];
  video: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  liked: any[];
  comments: any[];
  tags?: string;
}

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/posts?page=${currentPage}&limit=${postsPerPage}`);
        if (Array.isArray(response.data.data)) {
          console.log(response.data.data);
          
          setPosts(response.data.data);
        } else {
          console.error("Invalid post data:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);


  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen ms-80">
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Post Feed</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No posts available.</p>
        ) : (
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caption</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center cursor-pointer">
                      <img src={`http://localhost:8080/src/uploads/${post.userId.image}`} alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
                      <div className="text-sm font-medium text-gray-900">{post.userId.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{post.caption.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    {post.tags && post.tags.split(',').slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1">
                        #{tag.trim()}
                      </span>
                    ))}
                    {post.tags && post.tags.split(',').length > 2 && (
                      <span className="text-xs text-gray-500">+{post.tags.split(',').length - 2} more</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {post.video && <span className="text-sm text-gray-500">Video</span>}
                    {post.images && post.images.length > 0 && (
                      <span className="text-sm text-gray-500">{post.images.length} Image(s)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(post)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-6">
          <Pagination
            itemsPerPage={postsPerPage}
            totalItems={posts.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
               onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedPost.userId.name}'s Post</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {selectedPost.caption}
                </p>
                <div className="mt-4">
                  {selectedPost.tags && selectedPost.tags.split(',').map((tag, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  {selectedPost.video && (
                    <video
                      src={`http://localhost:8080/src/uploads/${selectedPost.video}`}
                      controls
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <div className={`grid gap-4 ${selectedPost.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {selectedPost.images.map((img, index) => (
                        <img
                          key={index}
                          src={`http://localhost:8080/src/uploads/${img}`}
                          alt={`Post Image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Posted on: {formatDate(selectedPost.createdAt)}
                </p>
              </div>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;