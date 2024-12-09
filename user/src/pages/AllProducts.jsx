import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./style/AllProducts.css";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 8; 
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/status/active"
        );

        // console.log(response.data.products)
        setProducts(response.data.products);
        setVisibleProducts(response.data.products.slice(0, productsPerPage));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const endIdx = nextPage * productsPerPage;
    setVisibleProducts(products.slice(0, endIdx));
    setCurrentPage(nextPage);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setVisibleProducts(filteredProducts.slice(0, productsPerPage));
    setCurrentPage(1);
  };

  return (
    <section className="py-12 px-6 bg-gray-50">
   
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

    
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-10">
        Explore Our Products
      </h2>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <div
              className="relative bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-transform hover:-translate-y-1"
              key={product._id}
            >
              
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate(`/${product._id}`)}
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Category: {product.categories.name}
                </p>
                <p className="text-sm text-gray-500">
                  Seller: {product.sellerName}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹{product.sellPrice}{" "}
                  <span className="line-through text-gray-500 text-sm">
                    ₹{product.price}
                  </span>
                </p>
              
                <p
                  className={`text-sm mt-1 ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <button
                  onClick={() => navigate(`/${product._id}`)}
                  className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No products found.
          </p>
        )}
      </div>


      {visibleProducts.length < products.length && (
        <div className="flex justify-center mt-12">
          <button
            className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            onClick={loadMoreProducts}
          >
            Load More Products
          </button>
        </div>
      )}
    </section>
  );
};

export default AllProducts;
