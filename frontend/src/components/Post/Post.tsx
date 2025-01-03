import React, { useState, useEffect, ChangeEvent } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import PostActions from './postActions';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

interface Post {
    _id: string;
    createdAt: string;
    caption: string;
    images?: string[];
    video?: string;
    tags?: string;
    userId: {
        _id:string;
        name: string;
        image:string;
    };
    liked?: string[];
    comments?: string[];
}
interface User{
    _id:string;

}
interface Creator {
    map(arg0: (creator: any) => import("react/jsx-runtime").JSX.Element): React.ReactNode;
    id: number;
    name: string;
    image: string;
  }
  interface Product {
    map(arg0: (creator: any) => import("react/jsx-runtime").JSX.Element): React.ReactNode;
    id: number;
    name: string;
    image: string;
  }



const MAX_IMAGES = 3;

const Post: React.FC = () => {
    const storedUser = useSelector((state: any) => state.user.user);
    const [user, setUser]= useState<User|null>(null);
    const [ creators,setCreators]=useState<Creator|null>(null);
    const [ProductList,setProductList]=useState<Product|null>(null)

    useEffect(() => {
        console.log(storedUser);
        if (storedUser ) {
            setUser(storedUser);
        }
    }, [storedUser]); 
    useEffect(() => {
        fetchProducts();
        fetchCreators();
    }, []);

    const fetchCreators = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/creators');
            console.log(response,'.....cra');
            if(Array.isArray(response.data.data)){
                setCreators(response.data.data);
            }
           
        } catch (error) {
            console.error('Error fetching creators:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get<{ data:any }>(`/api/auth/products`);
            const filteredData = response.data.data.filter(
                (product:any) => user?._id !== product?.userId._id && user?._id !== product?.collab._id
            );
            setProductList(filteredData);

        } catch (error) {
            console.error('Error fetching products:', error);
        
        }
    };

    

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [croppedImages, setCroppedImages] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [cropperKey, setCropperKey] = useState<number>(0);
    const navigate = useNavigate();

    const initialValues = {
        caption: '',
        images: [],
        video: '',
        tag: '',
    };

    const fetchPosts = async (page: number) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/auth/posts?page=${page}`);
            const fetchedPosts = response.data.data;
    
            setPosts(prevPosts => {
                const newPosts = fetchedPosts.filter((post:any) => !prevPosts.some(prevPost => prevPost._id === post._id));
                return [...prevPosts, ...newPosts];
            });
    
            if (fetchedPosts.length < 6) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );
    
        const target = document.querySelector('#load-more');
        if (target) {
            observer.observe(target);
        }
    
        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [hasMore, loading]);
    
    useEffect(() => {
        fetchPosts(page);
    }, [page]);
    const validationSchema = Yup.object().shape({
        caption: Yup.string().required('Please describe your idea'),
        tag: Yup.string().required('Please enter tags for reach to your destination'),
        images: Yup.array(),
        video: Yup.mixed(),
    });

    const handlePostSubmit = async (values: typeof initialValues, { resetForm }: any) => {
        setError(null);
    
        if (croppedImages.filter(img => img !== null).length === 0 && !values.video) {
            setError('Please upload at least one image or video.');
            return;
        }
    
        const formData = new FormData();
    
        formData.append('caption', values.caption);
        const validCroppedImages = croppedImages.filter(img => img !== null);
        
       
        for (let i = 0; i < validCroppedImages.length; i++) {
            const img = validCroppedImages[i];
            if (img.startsWith('data:image')) {
              
                const base64Image = img.split(',')[1];
                if (base64Image) {
                    try {
                        const blobBin = atob(base64Image);
                        const array = [];
                        for (let i = 0; i < blobBin.length; i++) {
                            array.push(blobBin.charCodeAt(i));
                        }
                        const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
                        formData.append(`images`, file, `image${i}.png`);
                    } catch (e) {
                        console.error("Failed to decode Base64 string:", e);
                        setError('Failed to process image.');
                    }
                }
            } else if (img.startsWith('blob:')) {
           
                try {
                    const response = await fetch(img);
                    const blob = await response.blob();
                    formData.append(`images`, blob, `image${i}.png`);
                } catch (e) {
                    console.error("Failed to fetch blob:", e);
                    setError('Failed to process image.');
                }
            } else {
                console.error("Invalid image data:", img);
                setError('Invalid image data.');
            }
        }
    
        if (values.video) formData.append('video', values.video);
        formData.append('tag', values.tag);
        
        
        if (user) {
            formData.append('userId', user?._id);
        } else {
            setError('User data is missing or invalid.');
            return;
        }
    
        try {
            const response = await axiosInstance.post('/api/auth/innovation', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.data.status) {
                resetForm();
                setCroppedImages([]);
                setVideoPreview(null);
                setPosts(response.data.data)
            } else {
                setError('Post submission failed: ' + response.data.message);
            }
        } catch (error) {
            setError('Error submitting post: ' + (error as Error).message);
        }
    };

    


    const handleCrop = () => {
        if (cropper && selectedImageIndex !== null) {
            const croppedImageData = cropper.getCroppedCanvas().toDataURL();
            setCroppedImages(prevCroppedImages => {
                const newCroppedImages = [...prevCroppedImages];
                newCroppedImages[selectedImageIndex] = croppedImageData;
                return newCroppedImages;
            });
            setSelectedImageIndex(null);
            setCropperKey(prevKey => prevKey + 1); 
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validExtensions = ['jpeg', 'jpg', 'png', 'gif'];

        for (let file of selectedFiles) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!validExtensions.includes(fileExtension || '')) {
                setError('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.');
                return;
            }
        }

        if (selectedFiles.length > MAX_IMAGES) {
            setError(`You can only upload up to ${MAX_IMAGES} images.`);
            return;
        }
      
        
        setFieldValue('images', selectedFiles);
        const uncroppedImages = selectedFiles.map(file => URL.createObjectURL(file));
        setCroppedImages(uncroppedImages);
        setCropperKey(prevKey => prevKey + 1); 
        setError(null);
    };

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const validExtensions = ['mp4', 'mov'];

            if (!validExtensions.includes(fileExtension || '')) {
                setError('Invalid file type. Only MP4 and MOV are allowed.');
                return;
            }

            if (file.size > 100 * 1024 * 1024) {
                setError('Video size should not exceed 100MB.');
                return;
            }

            setFieldValue('video', file);
            setVideoPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleSingleUser = (user: any) => {
        navigate('/userPage', { state: user });
    };
    const handleSelfPage=()=>{
        navigate('/userProfile')
    }


    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="hidden lg:block w-64 sticky top-0 left-0 bg-white shadow-lg rounded-lg p-4 m-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 1rem)' }}>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Top Creatives</h2>
                <ul className="space-y-2">
                    {creators && creators.map((creator:any) => (
                        <li key={creator._doc._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
                            <img
                                src={`https://hasth.mooo.com/src/uploads/${creator._doc.image}`}
                                alt={creator._doc.name}
                                className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <p onClick={() => (creator._doc._id===storedUser._id)?handleSelfPage():handleSingleUser(creator._doc)} className="text-lg font-semibold text-gray-800 cursor-pointer">
                                    {creator._doc.name}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex-1 p-20 space-y-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-3 text-gray-800">Share Your Thoughts</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handlePostSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form>
                                <Field
                                    as="textarea"
                                    name="caption"
                                    placeholder="What's on your mind?"
                                    className="w-full h-20 p-2 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage name="caption" component="div" className="text-red-500 text-sm" />

                                <div className="flex flex-wrap items-center gap-2">
                                    <label className="flex items-center cursor-pointer bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, setFieldValue)}
                                            className="hidden"
                                            multiple
                                            disabled={croppedImages.length >= MAX_IMAGES}
                                        />
                                        <span className="text-lg mr-1">📷</span> Add Photos
                                    </label>
                                    <label className="flex items-center cursor-pointer bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleVideoChange(e, setFieldValue)}
                                            className="hidden"
                                            disabled={videoPreview !== null}
                                        />
                                        <span className="text-lg mr-1">🎥</span> Add Video
                                    </label>
                                    <Field
                                        type="text"
                                        name="tag"
                                        placeholder="Add tags (comma-separated)"
                                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <ErrorMessage name="tag" component="div" className="text-red-500 text-sm" />

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold text-sm mt-2"
                                >
                                    Post
                                </button>
                            </Form>
                        )}
                    </Formik>

                    {error && <div className="text-red-500 mt-2">{error}</div>}

                    {selectedImageIndex !== null && (
                    <div className="mt-4">
                        <Cropper
                            key={cropperKey}
                            src={croppedImages[selectedImageIndex]}
                            style={{ height: 400, width: '100%' }}
                            aspectRatio={1}
                            guides={false}
                            crop={handleCrop}
                            onInitialized={(instance) => setCropper(instance)}
                        />
                        <button
                            onClick={handleCrop}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Crop Image
                        </button>
                    </div>
                )}

                {croppedImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {croppedImages.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={img}
                                    alt={`Selected Image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg cursor-pointer"
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button className="text-white bg-blue-500 px-2 py-1 rounded-lg text-xs" onClick={() => setSelectedImageIndex(index)}>Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                    {videoPreview && (
                        <div className="mt-3">
                            <video
                                src={videoPreview}
                                controls
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                
                <div className="mt-8 space-y-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Feed</h2>
                    {posts.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No posts available.</p>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg mb-6" >
                                <div className="flex items-center mb-6 cursor-pointer" onClick={() => (post.userId._id===storedUser._id)?handleSelfPage():handleSingleUser(post.userId)}>
                                    <img
                                        src={`https://hasth.mooo.com/src/uploads/${post.userId?.image}`}
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
  <div
    className={`grid gap-4 ${
      post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
    }`}
  >
    {post.images.map((img, index) => (
      <div key={index} className="w-full h-72 overflow-hidden rounded-lg">
        <img
          src={`https://hasth.mooo.com/src/uploads/${img}`}
          alt={`Post Image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    ))}
  </div>
)}

                                </div>
                                <PostActions 
                                    userId={user?._id||''} 
                                    post={post} 
                                    initialLikesCount={post.liked?.length || 0} 
                                    initialCommentsCount={post.comments?.length || 0} 
                                    isAuthor={user?._id===post.userId._id}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
            {hasMore && (
                <div id="load-more" className="text-center py-4">
                    
                </div>
            )}
<div className="hidden lg:block w-64 sticky top-0 left-0 bg-white shadow-lg rounded-lg p-4 m-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 1rem)' }}>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Products</h2>
                <ul className="space-y-2">
                    {ProductList&&ProductList.map((product:any)=>{
                            return <li key={product._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md">
                            <img
                                src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg" />
                            <div className="flex-1">
                                <p className="text-lg font-semibold text-gray-800 cursor-pointer">{product.name}</p>

                            </div>
                        </li>;
                    })}
                    

                </ul>
            </div>
        </div>
    );
};

export default Post;