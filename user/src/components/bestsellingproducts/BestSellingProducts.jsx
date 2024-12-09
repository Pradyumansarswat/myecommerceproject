import React from 'react';
import './BestSellingProducts.css';
import { FaRegHeart } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";


const products = [
  {
    id: 1,
    name: 'The north coat',
    price: 260,
    originalPrice: 360,
    image: '/products/pexels-ganimatque-8882288.jpg',
    rating: 5,
    reviews: 65,
  },
  {
    id: 2,
    name: 'Gucci duffle bag',
    price: 960,
    originalPrice: 1160,
    image: '/products/pexels-mtyutina-9443526.jpg',
    rating: 5,
    reviews: 65,
  },
  {
    id: 3,
    name: 'RGB liquid CPU Cooler',
    price: 160,
    originalPrice: 170,
    image: '/products/pexels-zeleboba-28948223.jpg',
    rating: 5,
    reviews: 65,
  },
  {
    id: 4,
    name: 'Small BookShelf',
    price: 360,
    originalPrice: null,
    image: '/products/pexels-taryn-elliott-4231428.jpg',
    rating: 5,
    reviews: 65,
  },
];

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-actions">
          <i ><FaRegHeart className="fas fa-heart"/></i>
          <i ><FaRegEye className="fas fa-eye"/></i>
        </div>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <div className="product-price">
        <span className="current-price">${product.price}</span>
        {product.originalPrice && <span className="original-price">${product.originalPrice}</span>}
      </div>
      <div className="product-rating">
        <span className="stars">⭐️⭐️⭐️⭐️⭐️</span>
        <span>({product.reviews})</span>
      </div>
    </div>
  );
};

const BestSellingProducts  = () => {
  return (
    <section className="best-selling-products">
      <div className="section-header">
        <span className="badge">This Month</span>
        <h2>Best Selling Products</h2>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellingProducts;
