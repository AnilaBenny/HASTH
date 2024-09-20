import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axiosconfig/Axiosconfig';
import { Calendar, ChevronLeft } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/allBlogs');
        setBlogs(response.data.data.Blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const truncateContent = (content: string, sentences: number) => {
    const sentenceRegex = /[.!?]+/;
    const truncated = content.split(sentenceRegex, sentences).join('. ');
    return truncated.length < content.length ? truncated + '...' : truncated;
  };

  if (selectedPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to All Blogs
        </button>
        <h1 className="text-4xl font-bold mb-6 text-gray-800">{selectedPost.title}</h1>
        <img
          src={`http://localhost:8080/src/uploads/${selectedPost.image}`}
          alt={selectedPost.title}
          className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg"
        />
        <div className="flex items-center mb-6 text-gray-600">
          <Calendar className="mr-2" size={20} />
          <p className="text-sm">
            {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="prose max-w-none">
          {selectedPost.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">Our Blog</h1>
      <div className="grid gap-12">
        {currentPosts.map((post) => (
          <div key={post._id} className="bg-white shadow-xl rounded-xl overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
            <img
              src={`http://localhost:8080/src/uploads/${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mb-4">{truncateContent(post.content, 2)}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        {Array.from({ length: Math.ceil(blogs.length / postsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-4 py-2 rounded-full ${
              currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition duration-300 ease-in-out`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;