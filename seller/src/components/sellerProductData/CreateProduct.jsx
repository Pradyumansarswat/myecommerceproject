import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/slices/sellerProductSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import { toast, Toaster } from "react-hot-toast";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.sellerProduct);
  const { categories } = useSelector((state) => state.category);

  const initialProductData = {
    name: "",
    description: "",
    price: "",
    sellPrice: "",
    stock: "",
    categories: "",
    images: null,
    variantImage: null,
    variants: [
      {
        color: "",
        size: "",
        price: "",
        sellPrice: "",
        stock: "",
        description: "",
        images: null,
      },
    ],
  };

  const [productData, setProductData] = useState(initialProductData);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([[]]);
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: files,
    }));

    // Preview images
    const fileArray = Array.from(files);
    const filePreviews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(filePreviews);
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...productData.variants];
    newVariants[index][name] = value;
    setProductData((prevData) => ({
      ...prevData,
      variants: newVariants,
    }));
  };

  const handleVariantFileChange = (index, e) => {
    const { files } = e.target;
    const newVariants = [...productData.variants];
    newVariants[index].images = files;
    setProductData((prevData) => ({
      ...prevData,
      variants: newVariants,
    }));

    // Preview variant images
    const fileArray = Array.from(files);
    const filePreviews = fileArray.map((file) => URL.createObjectURL(file));
    const newVariantImagePreviews = [...variantImagePreviews];
    newVariantImagePreviews[index] = filePreviews;
    setVariantImagePreviews(newVariantImagePreviews);
  };

  const addVariant = () => {
    setProductData((prevData) => ({
      ...prevData,
      variants: [
        ...prevData.variants,
        {
          color: "",
          size: "",
          price: "",
          sellPrice: "",
          stock: "",
          description: "",
          images: null,
        },
      ],
    }));
    setVariantImagePreviews((prev) => [...prev, []]); // Add a new array for the new variant
  };

  const removeVariant = (index) => {
    const newVariants = productData.variants.filter((_, i) => i !== index);
    setProductData((prevData) => ({
      ...prevData,
      variants: newVariants,
    }));
    const newVariantImagePreviews = variantImagePreviews.filter((_, i) => i !== index);
    setVariantImagePreviews(newVariantImagePreviews);
  };

  const removeImage = (index) => {
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newImagePreviews);
    const newImages = Array.from(productData.images).filter((_, i) => i !== index);
    setProductData((prevData) => ({
      ...prevData,
      images: newImages,
    }));
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const newVariantImagePreviews = [...variantImagePreviews];
    newVariantImagePreviews[variantIndex] = newVariantImagePreviews[variantIndex].filter((_, i) => i !== imageIndex);
    setVariantImagePreviews(newVariantImagePreviews);
    const newVariants = [...productData.variants];
    const newImages = Array.from(newVariants[variantIndex].images).filter((_, i) => i !== imageIndex);
    newVariants[variantIndex].images = newImages;
    setProductData((prevData) => ({
      ...prevData,
      variants: newVariants,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!token) {
      console.error("No token found");
    }

    const decodedToken = JSON.parse(atob(token.split("=")[1].split(".")[1]));
    if (!decodedToken.sellerId) {
      console.error("User ID not found in token");
      return;
    }

    formData.append("sellerId", decodedToken.sellerId);
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("sellPrice", productData.sellPrice);
    formData.append("stock", productData.stock);
    formData.append("categories", productData.categories);

    for (const file of productData.images) {
      formData.append("images", file);
    }

    productData.variants.forEach((variant) => {
      // Ensure all required fields are included
      formData.append("variants", JSON.stringify({
        color: variant.color,
        size: variant.size,
        price: variant.price,
        sellPrice: variant.sellPrice,
        stock: variant.stock,
        description: variant.description,
        images: variant.images // If applicable
      }));
      if (variant.images) {
        for (const file of variant.images) {
          formData.append("variantImage", file);
        }
      }
    });

    dispatch(createProduct(formData)).then(() => {
      setProductData(initialProductData); 
      setImagePreviews([]); 
      setVariantImagePreviews([[]]); 
      setComponentKey((prevKey) => prevKey + 1); 
      toast.success("Product Added Successfully");
    });
  };

  return (
    <div key={componentKey} className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <Toaster />
      <h2 className="text-2xl font-bold text-center mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            required
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="sellPrice"
              placeholder="Sell Price"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleChange}
            required
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="categories"
            onChange={handleChange}
            required
            className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex flex-col items-center mb-2">
            <label htmlFor="file" className="cursor-pointer flex flex-col items-center border-2 border-dashed border-blue-500 rounded-md p-4">
              <IoCloudUploadOutline size={30} className="text-blue-500" />
              <span className="font-semibold">Upload Product Pics</span>
              <input
                type="file"
                id="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="opacity-0 h-0"
                required
              />
            </label>
            <div className="flex flex-wrap mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 m-1">
                  <img src={preview} alt={`Product Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <IoIosClose/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Variants</h3>
          {productData.variants.map((variant, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="color"
                placeholder="Color"
                onChange={(e) => handleVariantChange(index, e)}
                required
                className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="size"
                placeholder="Size"
                onChange={(e) => handleVariantChange(index, e)}
                required
                className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  name="price"
                  placeholder="Variant Price"
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="sellPrice"
                  placeholder="Variant Sell Price"
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="number"
                name="stock"
                placeholder="Variant Stock"
                onChange={(e) => handleVariantChange(index, e)}
                required
                className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Variant Description"
                onChange={(e) => handleVariantChange(index, e)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col items-center mb-2">
                <label htmlFor={`variantImage-${index}`} className="cursor-pointer flex flex-col items-center border-2 border-dashed border-blue-500 rounded-md p-4">
                  <IoCloudUploadOutline size={30} className="text-blue-500" />
                  <span className="font-semibold">Upload Variant Pics</span>
                  <input
                    type="file"
                    id={`variantImage-${index}`}
                    name="variantImage"
                    multiple
                    onChange={(e) => handleVariantFileChange(index, e)}
                    className="opacity-0 h-0"
                    required
                  />
                </label>
                <div className="flex flex-wrap mt-2">
                  {variantImagePreviews[index] && variantImagePreviews[index].map((preview, idx) => (
                    <div key={idx} className="relative w-20 h-20 m-1">
                      <img src={preview} alt={`Variant Preview ${index}-${idx}`} className="w-full h-full object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(index, idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <IoIosClose/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Remove Variant
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Variant
          </button>
        </div> */}

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Create Product
        </button>
      </form>
      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateProduct;
