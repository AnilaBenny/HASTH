import { useEffect, useState } from "react";
import SearchBar from "../Userlist/SearchBar";
import axiosInstance from "../../Axiosconfig/Axiosconfig";

import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  caption: string;
  images: string[]; 
  video: string;
  userId: {
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/posts?page=${currentPage}&limit=${postsPerPage}`);
        if (Array.isArray(response.data.data)) {
          const posts = response.data.data;
          setPosts(posts);
          setFilteredPosts(posts);
        } else {
          console.error("Invalid post data:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.caption.toLowerCase().includes(lowerCaseQuery) ||
        post.userId.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPosts(filtered);
  };

  const handleSingleUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-3.5  ms-80">
    <div className="mt-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post Feed</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No posts available.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center mb-6" onClick={() => handleSingleUser(post.userId._id)}>
              <img
                src="/images/profile.png"
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{post.userId.name}</h3>
                <span className="text-sm text-gray-600">{formatDate(post.createdAt)}</span>
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
            
          </div>
        ))
      )}

      <Pagination
        itemsPerPage={postsPerPage}
        totalItems={filteredPosts.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
    </div>
  );
};

export default PostList;
