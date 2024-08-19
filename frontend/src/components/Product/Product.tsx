import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

interface ValidationErrors {
    name?: string;
    description?: string;
    brand?: string;
    countInStock?: string;
    price?: string;
    images?: string;
}

const Product: React.FC = () => {
    const user = useSelector(state => state.user);
    const [products, setProducts] = useState<Product[]>([]);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const navigate=useNavigate()
    const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
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
    });
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            const response = await axiosInstance.get<Creator[]>('/api/auth/creators');
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
            setError('Failed to fetch products. Please try again later.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name: string, value: string | number) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!/^\S.{0,99}$/.test(value as string)) {
                    error = 'Product Name must be between 1 and 100 characters.';
                }
                break;
            case 'description':
                if (!/^\S.{0,499}$/.test(value as string)) {
                    error = 'Description must be between 1 and 500 characters.';
                }
                break;
            case 'brand':
                if (!/^[a-zA-Z\s]+$/.test(value as string)) {
                    error = 'Brand must contain only letters and spaces.';
                }
                break;
            case 'price':
                if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                    error = 'Price must be a valid number with up to 2 decimal places.';
                }
                break;
            case 'countInStock':
                if (!/^(?:0|[1-9]\d{0,2}|300)$/.test(value.toString())) {
                    error = 'Stock must be a number between 0 and 300.';
                }
                break;
        }
        setValidationErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (files.length > 3) {
                setValidationErrors(prev => ({ ...prev, images: 'You can only upload a maximum of 3 files.' }));
                return;
            }
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const newPreviews: string[] = [];
            const newFiles: File[] = [];
    
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const extension = file.name.split('.').pop()?.toLowerCase();
                if (!extension || !validExtensions.includes(extension)) {
                    setValidationErrors(prev => ({ ...prev, images: 'Please upload only image files (jpg, jpeg, png, gif, webp).' }));
                    return;
                }
                newFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
    
            setValidationErrors(prev => ({ ...prev, images: '' }));
            setNewProduct(prev => ({ ...prev, images: newFiles }));
            setImagePreviews(newPreviews);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        Object.entries(newProduct).forEach(([key, value]) => {
            validateField(key, value);
        });
    
        if (Object.values(validationErrors).some(error => error !== '')) {
            setError('Please correct the errors in the form.');
            return;
        }
    
        try {
            const formData = new FormData();
            Object.entries(newProduct).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((file, index) => {
                        if (file instanceof File) {
                            formData.append(`images`, file);
                        }
                    });
                } else if (typeof value === 'string' || typeof value === 'number') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                }}
            )    
                    formData.append('userId',user._id)
            const response = await axiosInstance.post('/api/auth/addProduct', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            if (response.data.status) {
                setProducts(prev => [...prev, response.data.data]);
                setNewProduct({
                    name: '',
                    description: '',
                    collab: '',
                    images: [],
                    brand: '',
                    countInStock: 0,
                    review: [],
                    isFeatured: true,
                    price: 0,
                    popularity: 0,
                    list: true,
                });
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
    const handleProductClick = (product:any) => {
        navigate(`/productDetail`, { state: { product } });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                >
                    Add Product
                </button>
            </div>

          
            <div className="bg-white p-6 rounded-lg shadow-lg" >
                <h2 className="text-2xl font-semibold mb-4">Product List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300" onClick={() => handleProductClick(product)}>
                            {product.images.length > 0 && (
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
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-screen sm:max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="collab" className="block text-sm font-medium text-gray-700">Collab with</label>
                                <select
                                    id="collab"
                                    name="collab"
                                    value={newProduct.collab}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Select a creator</option>
                                    {creators.map((creator) => (
                                        <option key={creator._id} value={creator._id}>{creator.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {validationErrors.description && <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>}
                            </div>
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={newProduct.brand}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {validationErrors.brand && <p className="text-red-500 text-xs mt-1">{validationErrors.brand}</p>}
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    min="99"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {validationErrors.price && <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>}
                            </div>
                            <div>
                                <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    id="countInStock"
                                    name="countInStock"
                                    value={newProduct.countInStock}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="300"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                {validationErrors.countInStock && <p className="text-red-500 text-xs mt-1">{validationErrors.countInStock}</p>}
                            </div>
                            <div>
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="mt-1 block w-full"
                                />
                                {validationErrors.images && <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>}
                            </div>
                            <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                onChange={handleImageChange}
                                multiple
                                accept="image/*"
                                className="mt-1 block w-full"
                            />
                            {validationErrors.images && <p className="text-red-500 text-xs mt-1">{validationErrors.images}</p>}
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
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;