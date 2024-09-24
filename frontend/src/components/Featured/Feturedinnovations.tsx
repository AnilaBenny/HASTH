import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../Axiosconfig/Axiosconfig';

const FeaturedInnovations = () => {
  const user = useSelector((state: any) => state.user.user);
  const [products, setProducts] = useState<any[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/api/auth/posts`);
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-2 text-yellow-400" />
          <span className="bg-clip-text">
            HASTH, Where Your Ideas Meet
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
                <div key={index} className="flex-none w-72 transform transition duration-500 hover:scale-105">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6">
                      <p className="text-sm text-gray-600 line-clamp-3">{product.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 ${
              isHovering ? 'opacity-100 -left-4' : 'opacity-0 left-0'
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 ${
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

export default FeaturedInnovations;