import React, { useEffect, useState } from "react";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import SearchBar from "../Userlist/SearchBar";
import Pagination from "../Pagination/Pagination";
import ProductModal from "./ProductDetailAdmin";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  list: boolean;
  images: string[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openModal,setOpenModal]=useState(false)
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/products?page=${currentPage}&limit=${productsPerPage}`);
        if (Array.isArray(response.data.data)) {
          setProducts(response.data.data);
          setFilteredProducts(response.data.data);
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
         product.description.toLowerCase().includes(lowerCaseQuery)) 
    );
    setFilteredProducts(filtered);
  };




  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true)
  };

  return (
    <div className="pl-64 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center my-4">
          <h1 className="text-2xl font-bold">Product List</h1>
        </div>

        <div className="flex justify-between mb-4 w-full">
          <SearchBar onSearch={handleSearch} />
 
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img
                      src={`http://localhost:8080/src/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b max-w-xs truncate">{product.description}</td>
                  <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded ${
                      product.list
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {product.list ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            itemsPerPage={productsPerPage}
            totalItems={filteredProducts.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      {openModal && (
        <ProductModal product={selectedProduct} isOpen={true} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default ProductList;