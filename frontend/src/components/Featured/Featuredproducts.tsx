import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useSelector } from 'react-redux';

interface FeaturedProductsProps {
  title: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title }) => {
  const user = useSelector((state: any) => state.user.user);
  const [products, setProducts] = useState<any[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/products`);
        if (user) {
          const filteredData = response.data.data.filter(
            (product: any) => user._id !== product?.userId?._id && user._id !== product?.collab?._id
          );
          setProducts(filteredData);
        } else {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [user]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          <span className="bg-clip-text">
            {title}
          </span>
        </h2>
        <div 
          className="relative" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex space-x-6 transition-all duration-300 ease-in-out">
              {products.map((product, index) => (
                <div key={index} className="flex-none w-64 transform transition duration-500 hover:scale-105">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img
                      src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-sm font-medium text-indigo-600">Rs. {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 ${
              isHovering ? 'opacity-100 -left-4' : 'opacity-0 left-0'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 ${
              isHovering ? 'opacity-100 -right-4' : 'opacity-0 right-0'
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;