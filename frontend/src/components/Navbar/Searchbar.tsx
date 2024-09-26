import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../Axiosconfig/Axiosconfig";
import { useNavigate } from "react-router-dom";

const Searchbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`/api/auth/search?q=${query}`);
        setSuggestions(response.data.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setQuery('')
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsDropdownVisible(true);
  };
const navigate=useNavigate()
  const handleSuggestionClick = (product: any) => {
    setQuery('')
    setIsDropdownVisible(false);
    navigate('/productDetail', { state: {product} });
  };

  return (
    <div ref={searchContainerRef} className="relative flex items-center justify-center my-4 pe-20">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-96 max-w-md px-4 py-2 rounded-lg placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isDropdownVisible && (
        <div className="absolute z-10 w-full mt-28 bg-white rounded-lg shadow-xl">
          {suggestions.length > 0 ? (
            <ul className="pe-20 overflow-auto max-h-96">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://hasth.mooo.com/src/uploads/${product.images[0]}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Rs.{product.price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-sm text-gray-500">No products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;