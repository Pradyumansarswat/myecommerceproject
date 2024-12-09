import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleAllProduct = () => {
    navigate("/all-products");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/status/active"
        );
        const updatedProducts = response.data.products.map((product) => ({
          ...product,
          isNew: product.isNew !== undefined ? product.isNew : Math.random() < 0.5,
          reviews: product.reviews !== undefined ? product.reviews : Math.floor(Math.random() * 100) + 1,
          images: product.images,
          name: product.name,
          sellingPrice: product.sellingPrice,
        }));

        setProducts(updatedProducts.sort(() => 0.5 - Math.random()).slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between bg-black text-white p-6 rounded-lg mb-10 relative overflow-hidden animate-slide-in">
        <div className="hero-content">
          <h2 className="text-4xl mb-4 animate-fade-in">Enhance Your Music Experience</h2>
          <p className="text-lg mb-6 animate-fade-in">23 hours | 45 mins | 6% cashback | 35% discount</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform transition duration-300 ease-in-out animate-fade-in">
            Buy Now!
          </button>
        </div>
        <img
          src="https://t3.ftcdn.net/jpg/04/73/58/46/360_F_473584655_7jOS3CSPG1W7Eidrb27WCqxzgStfHPK7.jpg"
          alt="Speaker"
          className="max-w-[50%] rounded-lg transform transition-all duration-500 ease-in-out hover:scale-105"
        />
      </div>

      <div className="text-center mb-10 animate-fade-in">
        <h2 className="text-3xl mb-5 inline-block relative pb-3">
          Explore Our Products
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 animate-slide-in"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                className="relative p-4 bg-gray-100 rounded-lg shadow-lg hover:translate-y-[-10px] hover:shadow-xl transition-all duration-300 ease-in-out group"
                key={product._id}
                onClick={() => navigate(`${product._id}`)}
              >
                <div className="relative overflow-hidden rounded-lg">
              
                  <div className="h-[300px] overflow-hidden relative">
                    <img
                      src={`http://localhost:5000/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                </div>
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs py-1 px-3 rounded-full animate-pulse">
                    New
                  </span>
                )}
                <h3 className="text-xl mb-2 font-semibold">{product.name}</h3>
                <p className="text-lg mb-2 font-bold text-gray-800">${product.sellPrice}</p>
                <p className="text-lg mb-2 font-bold text-gray-800">{product.description}</p>
                <p className="text-lg mb-2 text-yellow-500">⭐⭐⭐⭐⭐ ({product.reviews})</p>
               
              </div>
            ))
          ) : (
            <p>No products available at the moment.</p>
          )}
        </div>
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 mt-6 transform transition-all duration-300 ease-in-out"
          onClick={handleAllProduct}
        >
          View All Products
        </button>
      </div>
    </section>
  );
};

export default OurProducts;
