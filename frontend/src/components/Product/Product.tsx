import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import { addToCart,updateQuantity } from '../../store/slices/cartSlice';
 

interface Product {
    _id: string;
    name: string;
    description: string;
    collab?: string;
    images: string[] | File[];
    brand: string;
    countInStock: number;
    review: Array<{
        user: string;
        rating: number;
        reviewdescription: string;
    }>;
    isFeatured: boolean;
    price: number;
    popularity: number;
    list: boolean;
}

interface Creator {
    
    _id: string;
    name: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
    description: Yup.string().required('Description is required').max(500, 'Description must be at most 500 characters'),
    brand: Yup.string().required('Brand is required').matches(/^[a-zA-Z\s]+$/, 'Brand must contain only letters and spaces'),
    price: Yup.number()
    .required('Price is required')
    .min(99, 'Price must be at least 99')
    .test(
        'is-decimal',
        'Price must have up to 2 decimal places',
        (value) => value !== undefined && value.toString().match(/^\d+(\.\d{1,2})?$/) !== null
    ),
    countInStock: Yup.number().required('Stock is required').min(0, 'Stock must be at least 0').max(300, 'Stock must be at most 300').integer('Stock must be an integer'),
    collab: Yup.string().required('Collab is required'),
});


const Product: React.FC = () => {
    const user = useSelector((state:any) => state.user.user);
    const [products, setProducts] = useState<Product[]>([]);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate=useNavigate()
    const initialValues={
        collab: '',
        name: '',
        description: '',
        images: [],
        brand: '',
        countInStock: 0,
        review: [],
        isFeatured: true,
        price: 0,
        popularity: 0,
        list: true,
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(URL.revokeObjectURL);
        };
    }, [imagePreviews]);

    useEffect(() => {
        fetchProducts();
        fetchCreators();
    }, []);

    const fetchCreators = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/creators');
            console.log(response,'.....cra');
            
            setCreators(response.data.data);
        } catch (error) {
            console.error('Error fetching creators:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get<{ data: Product[] }>('/api/auth/products');
            console.log(response);
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const files = e.target.files;
        if (files) {
            if (files.length > 3) {
                setError('You can only upload a maximum of 3 files.');
                return;
            }
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const newPreviews: string[] = [];
            const newFiles: File[] = [];
    
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const extension = file.name.split('.').pop()?.toLowerCase();
                if (!extension || !validExtensions.includes(extension)) {
                    setError('Please upload only image files (jpg, jpeg, png, gif, webp).');
                    return;
                }
                newFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
    
            setFieldValue('images', newFiles);
            setImagePreviews(newPreviews);
            setError(null);
        }
    };

    const handleSubmit = async (values: Omit<Product, '_id'>, { resetForm }: { resetForm: () => void }) => {
        setError(null);
    
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((file) => {
                        if (file instanceof File) {
                            formData.append(`images`, file);
                        }
                    });
                } else if (typeof value === 'string' || typeof value === 'number') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                }
            });
            formData.append('userId', user._id);

            const response = await axiosInstance.post('/api/auth/addProduct', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            if (response.data.status) {
                setProducts(prev => [...prev, response.data.data]);
                resetForm();
                setImagePreviews([]);
                setIsModalOpen(false);
            } else {
                setError('Failed to add product. Please try again.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setError('An error occurred while adding the product. Please try again.');
        }
    };

    const handleProductClick = (product: any) => {
        navigate(`/productDetail`, { state: { product } });
    };
    
        

    const dispatch=useDispatch()
    const cart=useSelector((state:any)=>state.cart.cart)
const handleAddToCart = async (productId: string) => {
    
    try {
        const response = await axiosInstance.post('/api/auth/addtocart', { productId,userId:user._id});
        console.log(response,'product');
        if (response.data.status) {
            if (cart && cart.items) {
                const existingCartItem = cart.items.find((item: any) => item.productId._id=== productId);
                console.log(existingCartItem,'exist....');
                
                if (existingCartItem) {
                    console.log(existingCartItem._id,existingCartItem.quantity + 1,'.....cart');
                    
                    dispatch(updateQuantity({
                        itemId: existingCartItem._id,
                        quantity: existingCartItem.quantity + 1
                    }));
                    toast.success('Product quantity updated in cart');
                } else {
                dispatch(addToCart(response.data.data));
                toast.success('Product added to cart successfully');
            }}else {
                dispatch(addToCart(response.data.data));
                toast.success('Product added to cart successfully');
            }
        } else {
            if (response.data.message === 'PRODUCT_LIMIT_EXCEEDED') {
                toast.error('You cannot add more than 5 products to your cart');
            } else if (response.data.error === 'OUT_OF_STOCK') {
                toast.error('Product is out of stock');
            } else {
                toast.error('Failed to add product to cart');
            }
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        toast.error('An error occurred while adding the product to cart');
    }
};

    return (
        <div className="bg-gray-100 min-h-screen">
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-400 text-gray-900 py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
            >
                Add Product
            </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Product List</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                        <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                            {product.images.length > 0 && (
                                <img
                                    src={`http://localhost:8080/src/uploads/${product.images[0]}`}
                                    alt={product.name}
                                    className="w-full h-48 object-contain rounded-md mb-4"
                                />
                            )}
                            <h3 className="text-lg font-semibold mb-2 text-blue-600 hover:text-orange-500">{product.name}</h3>
                            <div className="flex items-center mb-2">
                                <span className="text-blue-400 mr-1">★★★★☆</span>
                                <span className="text-gray-600 text-sm">(123)</span>
                            </div>
                            <p className="text-red-600 font-bold text-xl mb-2">₹{product.price.toFixed(2)}</p>
                            <p className="text-gray-600 mb-2 line-clamp-2 text-sm">{product.description}</p>
                            <p className="text-gray-500 text-sm">Brand: {product.brand}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {product.countInStock > 0 ? (
                                    <span className="text-green-600">In Stock: {product.countInStock}</span>
                                ) : (
                                    <span className="text-red-600">Out of Stock</span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => handleAddToCart(product._id)}
                            className="mt-4 w-full bg-blue-400 text-gray-900 py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
                            disabled={product.countInStock === 0}
                        >
                            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-screen sm:max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form className="space-y-4">
                                <div>
                                    <label htmlFor="collab" className="block text-sm font-medium text-gray-700">Collab with</label>
                                    <Field
                                        as="select"
                                        id="collab"
                                        name="collab"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select a creator</option>
                                        {creators.map((creator) => (
                                            <option key={creator._doc._id} value={creator._doc._id}>{creator._doc.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="collab" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                                
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                                    <Field
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <ErrorMessage name="brand" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                    <Field
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="99"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <ErrorMessage name="price" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            
                                <div>
                                    <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Stock</label>
                                    <Field
                                        type="number"
                                        id="countInStock"
                                        name="countInStock"
                                        min="0"
                                        max="300"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <ErrorMessage name="countInStock" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                                
                                <div>
                                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                        multiple
                                        accept="image/*"
                                        className="mt-1 block w-full"
                                    />
                                    <ErrorMessage name="images" component="p" className="text-red-500 text-xs mt-1" />
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-2 flex space-x-2">
                                            {imagePreviews.map((preview, index) => (
                                                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;