
import './Featured.css';
import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { useSelector } from 'react-redux';

interface FeaturedproductsProps {
  title: string;
}
const user=useSelector((state:any)=>state.user.user)
const Featuredproducts:React.FC<FeaturedproductsProps> = ({title}) => {
  
const [products,setProducts]=useState<any[]>([]);
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
}, []); 


  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="featured-products-container">
      <h2 className="section-title">{title}</h2>
      <br></br>
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={scrollLeft}><FaChevronLeft/></button>
        <div className="products-scroll" ref={carouselRef}>
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image[0]} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={scrollRight}><FaChevronRight/></button>
      </div>
    </div>
  );

};

export default Featuredproducts;


