import  { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const BlogSchema = Yup.object().shape({
  title: Yup.string().required('Blog title is required'),
  content: Yup.string().required('Blog content is required'),
});

interface FormValues {
  title: string;
  content: string;
  image: File | null;
}

const initialValues: FormValues = {
  title: '',
  content: '',
  image: null,
};

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: Date;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface FormValues {
  title: string;
  content: string;
  image: File | null;
}

export default  () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  const blogsPerPage = 5;

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

  useEffect(() => {
    const results = blogs.filter((blog: Blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(results);
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const handleAddBlog = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      if (values.image) {
        formData.append('image', values.image);
      }

      const response = await axiosInstance.post('/api/auth/admin/createblog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    console.log(response);
    
      
      if (response.status === 200) {
        setBlogs(response.data.data);
        toast.success('Blog created successfully');
        setIsAddModalOpen(false);
        resetForm();
      } else {
        toast.error('There was a problem creating the blog');
      }
    } catch (error) {
      toast.error('Error: Server error');
    }
  };



  const handleDeleteBlog = async (id: string) => {
    const confirmDelete = () => {
      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            const response = await axiosInstance.delete(`/api/auth/deleteblog/${id}`);
            if (response.data.status) {
              setBlogs((prevBlogs) => prevBlogs.filter((blog: Blog) => blog._id !== id));
              resolve('Blog deleted successfully');
            } else {
              reject('There was a problem deleting the blog');
            }
          } catch (error) {
            reject('Error: Server error');
          }
        }),
        {
          pending: 'Processing...',
          success: 'Blog deleted successfully',
          error: 'Failed to delete the blog',
        }
      );
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    };

    toast.info(
      <div className="text-center">
        <p className="text-lg font-semibold mb-4">Are you sure you want to delete this blog?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition duration-300"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: 'bg-white shadow-lg rounded-lg p-6 max-w-sm w-full mx-auto',
      }
    );
  };

  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {children}
          <button onClick={onClose} className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    );
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container ps-72 pt-16 pe-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add Blog
        </button>
      </div>

      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog: Blog) => (
            <tr key={blog._id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                <div className="text-sm leading-5 font-medium text-gray-900">{blog.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                <div className="text-sm leading-5 text-gray-500">{new Date(blog.createdAt).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 font-medium">
                <button onClick={() => { setCurrentBlog(blog); setIsDetailsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mr-2">
                  Details
                </button>

                <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredBlogs.length / blogsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Blog">
        <Formik
          initialValues={initialValues}
          validationSchema={BlogSchema}
          onSubmit={handleAddBlog}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="title"
                  placeholder="Blog Title"
                  className="w-full p-2 mb-4 border rounded"
                />
                {errors.title && touched.title ? (
                  <div className="text-red-500 text-sm">{errors.title}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <Field
                  as="textarea"
                  name="content"
                  placeholder="Blog Content"
                  className="w-full p-2 mb-4 border rounded h-32"
                />
                {errors.content && touched.content ? (
                  <div className="text-red-500 text-sm">{errors.content}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  name="image"
                  className="w-full p-2 mb-4 border rounded"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setFieldValue('image', file);
                  }}
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Blog
              </button>
            </Form>
          )}
        </Formik>
      </Modal>


      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={currentBlog?.title || ''}>
        <img src={`http://localhost:8080/src/uploads/${currentBlog?.image}`} alt={currentBlog?.title} className="w-full h-48 object-cover rounded-md mb-4" />
        <p className="text-sm text-gray-500 mb-2">Published on: {currentBlog ? new Date(currentBlog.createdAt).toLocaleString() : ''}</p>
        <p>{currentBlog?.content}</p>
      </Modal>
    </div>
  );
};

