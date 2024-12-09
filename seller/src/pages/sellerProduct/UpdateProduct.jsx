import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRegSave } from "react-icons/fa"; // Removed save icon import for images

import {
  fetchProductById,
  updateProduct,
} from "../../redux/slices/sellerProductSlice";

const UpdateProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, status, error } = useSelector(
    (state) => state.sellerProduct
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const resultAction = await dispatch(updateProduct({ productId, productData: formData }));
    if (updateProduct.fulfilled.match(resultAction)) {
      console.log("Product updated successfully");
      navigate(`/seller/products/${productId}`);
    } else {
      console.error("Failed to update product:", resultAction.error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="flex justify-center items-center h-auto bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-3/4 md:w-1/2"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Update Product</h1>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-10 w-full outline-none bg-gray-200 border-b border-gray-500 p-2 text-gray-700 rounded focus:bg-white transition duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="h-10 w-full outline-none bg-gray-200 border-b border-gray-500 p-2 text-gray-700 rounded focus:bg-white transition duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="font-semibold">Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="h-10 w-full outline-none bg-gray-200 border-b border-gray-500 p-2 text-gray-700 rounded focus:bg-white transition duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold">Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="h-10 w-full outline-none bg-gray-200 border-b border-gray-500 p-2 text-gray-700 rounded focus:bg-white transition duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center justify-center"
          >
            <FaRegSave className="mr-2" />
            Update Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateProduct;
