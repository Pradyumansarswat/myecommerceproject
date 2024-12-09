import React,  {useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBySellerId, fetchProductsByStatus, fetchProductsByCategory } from "../../redux/slices/sellerProductSlice";
import { getCategories } from "../../redux/slices/categorySlice"; 
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ShowProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useSelector(
    (state) => state.sellerProduct
  );
  const { categories } = useSelector((state) => state.category); 
  const [selectedStatus, setSelectedStatus] = useState("all"); 
  const [selectedCategory, setSelectedCategory] = useState(""); 

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const sellerId = decodedToken.sellerId;
      dispatch(fetchProductsBySellerId(sellerId));
      dispatch(getCategories()); 
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const sellerId = decodedToken.sellerId;
      dispatch(fetchProductsByCategory({ sellerId, categoryId: selectedCategory })); 
    } else {
      if (selectedStatus === "all") {
        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        const sellerId = decodedToken.sellerId;
        dispatch(fetchProductsBySellerId(sellerId)); 
      } else {
        dispatch(fetchProductsByStatus(selectedStatus)); 
      }
    }
  }, [selectedStatus, selectedCategory, dispatch]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value); 
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (status === "loading") {
    return <div className="text-lg text-gray-600 text-center">Loading...</div>;
  }

  if (status === "failed") {
    return (
      <div className="text-lg text-red-600 text-center">Error: {error}</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
      <div className="mb-4 flex justify-end">
        <label htmlFor="status" className="mr-2 text-lg font-semibold">Filter by Status:</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-md p-2 text-lg font-medium"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <label htmlFor="category" className="ml-4 mr-2 text-lg font-semibold">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-md p-2 text-lg font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Sell Price</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-200">
                <td className="py-2 px-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000/${product.images[0]}`}
                      alt={product.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </td>
                {console.log(product)}
                <td className="py-2 px-4">{product.name}</td>
                {console.log(product)}
                <td className="py-2 px-4">{(selectedStatus === 'all' && selectedCategory === '') ? product.categoryName  : product.categories?.name}</td> 
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4 cursor-pointer" title="view details" onClick={() => navigate(`/seller/products/${product._id}`)}>
                  <HiDotsVertical size={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowProduct;
