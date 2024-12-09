import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategoryPage.css';

const CategoryPage = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products?categoryId=${category.id}`);
        setProducts(response.data.products);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  return (
    <div className="category-page">
      <h1>{category?.name}</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <h2 className="product-title">{product.name}</h2>
              <p className="product-price">${product.price}</p>
              <button className="add-to-cart-button">Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
