import './Featured.css';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
const FeaturedInnovations = () => {
  const products = [
    { id: 1, name: 'Post 1', image: '/images/products/product1.webp', description: "Description for Post 1" },
    { id: 2, name: 'Post 2', image: '/images/products/product2.webp', description: 'Description for Post 2' },
    { id: 3, name: 'Post 3', image: '/images/products/product3.webp', description: 'Description for Post 3' },
    { id: 4, name: 'Post 4', image: '/images/products/product4.webp', description: 'Description for Post 4' },
    { id: 5, name: 'Post 5', image: '/images/products/product5.webp', description: 'Description for Post 5' },
    { id: 6, name: 'Post 6', image: '/images/products/product1.webp', description: 'Description for Post 6' },
    { id: 7, name: 'Post 7', image: '/images/products/product2.webp', description: 'Description for Post 7' },
    { id: 8, name: 'Post 8', image: '/images/products/product3.webp', description: 'Description for Post 8' },
    { id: 9, name: 'Post 9', image: '/images/products/product4.webp', description: 'Description for Post 9' },
    { id: 10, name:'Post 10', image: '/images/products/product5.webp', description: 'Description for Post 10' },
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
      <h2 className="post-title">HASTH, Where Your Ideas Meet</h2>
      <br></br>
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={scrollLeft}><FaChevronLeft/></button>
        <div className="products-scroll" ref={carouselRef}>
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="post-image" />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={scrollRight}><FaChevronRight/></button>
      </div>
    </div>
  );
}

export default FeaturedInnovations;
