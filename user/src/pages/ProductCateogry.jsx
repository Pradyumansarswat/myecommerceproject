import React, { useEffect, useState } from "react";
import "./style/ProductCategory.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductCategory = () => {
  const [products, setProducts] = useState([]);
  const categoryId = useParams();
  const CateId = categoryId.categoryId;
 

  const onProductClick = (id) => {
    window.location.href = `/${id}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/category/${CateId}`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [CateId]);

  return (
    <div className="product-category">
      <h1>Products in this Category</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              onClick={() => onProductClick(product._id)}
              className="product-card"
              key={product._id}
            >
              <img
                src={`http://localhost:5000/${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                Price: <span className="actual-price">{product.price} Rs</span>
                <span className="sell-price">{product.sellPrice} Rs</span>
              </p>
              <p className="product-stock">Stock: {product.stock}</p>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
