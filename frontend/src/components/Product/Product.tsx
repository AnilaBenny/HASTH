import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addToCart, updateQuantity } from '../../store/slices/cartSlice';
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
    const [addtocart,setAddtoCart]=useState(true)
    const navigate=useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8); 
    const [totalProducts, setTotalProducts] = useState(0);
    const dispatch=useDispatch()
    const cart=useSelector((state:any)=>state.cart.cart)
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
    useEffect(() => {
        fetchProducts();
    }, [currentPage, productsPerPage]);
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
            const response = await axiosInstance.get<{ data: Product[] }>(`/api/auth/products?page=${currentPage}&limit=${productsPerPage}`);
            const filteredData = response.data.data.filter(
                (product:any) => user._id !== product?.userId._id && user._id !== product?.collab._id
            );
            setProducts(filteredData);
            setTotalProducts(filteredData.length);
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
                const filteredData = response.data.data.filter(
                    (product:any) => user._id !== product?.userId._id && user._id !== product?.collab._id
                );
                setProducts(filteredData);
                toast.success('product added successfully')
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
const showyourproducts=async()=>{
    const response = await axiosInstance.get<{ data: Product[] }>('/api/auth/products');
    console.log(response);
    const filteredData=response.data.data.filter((product:any)=>user._id===product?.userId._id||user._id===product?.collab._id)
    setProducts(filteredData);
    setAddtoCart(false)
}

return (
    <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Product Management</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 shadow-md"
                    >
                        Add Product
                    </button>
                    <button
                    onClick={() => {
                        if (addtocart) {
                        showyourproducts(); 
                        } else {
                        setAddtoCart(true);
                        window.location.reload()
                        }
                    }}
                    className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-300 shadow-md"
                    >
                    {addtocart ? "Show Your Products" : "See Other Products"}
                    </button>

                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Product List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div key={product._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                            <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                                {product.images.length > 0 && (
                                    <img
                                        src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                                        alt={product.name}
                                        className="w-full h-56 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600">{product.name}</h3>
                                    <div className="flex items-center mb-2">
                                        <span className="text-yellow-400 mr-1">★★★★☆</span>
                                        <span className="text-gray-600 text-sm">(123)</span>
                                    </div>
                                    <p className="text-red-600 font-bold text-2xl mb-2">₹{product.price.toFixed(2)}</p>
                                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{product.description}</p>
                                    <p className="text-gray-500 text-sm">Brand: {product.brand}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {product.countInStock > 0 ? (
                                            <span className="text-green-600">In Stock: {product.countInStock}</span>
                                        ) : (
                                            <span className="text-red-600">Out of Stock</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {addtocart && (
                                <div className="px-4 pb-4">
                                    <button
                                        onClick={() => handleAddToCart(product._id)}
                                        className={`w-full py-2 px-4 rounded-full transition duration-300 ${
                                            product.countInStock > 0
                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        disabled={product.countInStock === 0}
                                    >
                                        {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === number
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-9">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add New Product</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label htmlFor="collab" className="block text-sm font-medium text-gray-700 mb-1">Collab with</label>
                                    <Field
                                        as="select"
                                        id="collab"
                                        name="collab"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a creator</option>
                                        {creators.map((creator:any) => (
                                            <option key={creator._doc._id} value={creator._doc._id}>{creator._doc.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="collab" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <Field
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="brand" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <Field
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="99"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="price" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <Field
                                        type="number"
                                        id="countInStock"
                                        name="countInStock"
                                        min="0"
                                        max="300"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="countInStock" component="p" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        onChange={(e) => handleImageChange(e, setFieldValue)}
                                        multiple
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                                <div className="flex justify-end space-x-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
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