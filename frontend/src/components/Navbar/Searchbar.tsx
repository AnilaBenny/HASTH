import React, { useState, useEffect } from "react";
import axiosInstance from "../../Axiosconfig/Axiosconfig";

const Searchbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
       
        const response = await axiosInstance.get(`/api/auth/search?q=${query}`);
        setSuggestions(response.data.products);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    
    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimeout); 
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsDropdownVisible(true);
  };


  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name); 
    setIsDropdownVisible(false);
  };

  return (
    <div className="relative flex items-center justify-center my-4 pe-20">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="w-96 max-w-md px-4 py-2 rounded-lg placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isDropdownVisible && suggestions.length > 0 && (
        <ul className="absolute top-full mt-2 w-96 max-w-md bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {suggestions.map((product) => (
            <li
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(product)}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbar;
