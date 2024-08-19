import { useEffect, useState, useCallback } from "react";
import SearchBar from "../Userlist/SearchBar";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from "../Pagination/Pagination";
import ProductModal from "./ProductDetailAdmin";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  imageUrl: string; // Add imageUrl to Product type
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/products?page=${currentPage}&limit=${productsPerPage}`);
        if (Array.isArray(response.data.data)) {
          const products = response.data.data;
          setProducts(products);
          setFilteredProducts(products);
        } else {
          console.error("Invalid product data:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, filter]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = products.filter(
      (product) =>
        (product.name.toLowerCase().includes(lowerCaseQuery) ||
         product.description.toLowerCase().includes(lowerCaseQuery)) &&
        (filter === 'all' || product.isActive === (filter === 'active'))
    );
    setFilteredProducts(filtered);
  };

  const handleProductStatus = async (productId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/api/products/toggleProductStatus/${productId}`
      );
      const updatedProduct = response.data.data;
      
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );

      toast.success(`Product status updated successfully`);
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error('Failed to update product status');
    }
  };

  const applyFilter = useCallback(
    (allProducts: Product[], filterType: "all" | "active" | "inactive") => {
      if (filterType === "all") {
        setFilteredProducts(allProducts);
      } else {
        const filtered = allProducts.filter(
          (product) => product.isActive === (filterType === "active")
        );
        setFilteredProducts(filtered);
      }
    },
    []
  );

  useEffect(() => {
    applyFilter(products, filter);
  }, [filter, products, applyFilter]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="pl-64 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center my-4">
          <h1 className="text-2xl font-bold">Product List</h1>
        </div>

        <div className="flex justify-between mb-4 w-full">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center">
            {['all', 'active', 'inactive'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                } hover:bg-blue-700`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentProducts.map((product) => (
            <div key={product._id} className="bg-white border rounded-lg shadow-md overflow-hidden">
              <img
                src={`http://localhost:8080/src/uploads/${product.images[0]}`}
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
                <p className={`text-sm mt-2 ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </p>
                <div className="mt-4 flex justify-between">
                  
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          itemsPerPage={productsPerPage}
          totalItems={filteredProducts.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default ProductList;
