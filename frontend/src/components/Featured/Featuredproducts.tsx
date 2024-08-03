
import './Featured.css';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface FeaturedproductsProps {
  title: string;
}

const Featuredproducts:React.FC<FeaturedproductsProps> = ({title}) => {
  
  const products = [
    { id: 1, name: 'Product 1', image: '/images/products/product1.webp', price: '$100' },
    { id: 2, name: 'Product 2', image: '/images/products/product2.webp', price: '$150' },
    { id: 3, name: 'Product 3', image: '/images/products/product3.webp', price: '$200' },
    { id: 4, name: 'Product 4', image: '/images/products/product4.webp', price: '$250' },
    { id: 5, name: 'Product 5', image: '/images/products/product5.webp', price: '$300' },
    { id: 6, name: 'Product 1', image: '/images/products/product1.webp', price: '$100' },
    { id: 7, name: 'Product 2', image: '/images/products/product2.webp', price: '$150' },
    { id: 8, name: 'Product 3', image: '/images/products/product3.webp', price: '$200' },
    { id: 9, name: 'Product 4', image: '/images/products/product4.webp', price: '$250' },
    { id: 10, name: 'Product 5', image: '/images/products/product5.webp', price: '$300' },
  ];

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
              <img src={product.image} alt={product.name} className="product-image" />
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


