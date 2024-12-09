import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  deleteProductImage,
  updateProductStock,
} from "../../redux/slices/sellerProductSlice";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaStar, FaTrash, FaAngleDoubleDown } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

const ProductDetails = () => {
  const [showAcc, setShowAcc] = useState(false);
  const onAccClick = () => {
    setShowAcc(!showAcc);
  };
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector(
    (state) => state.sellerProduct
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newStock, setNewStock] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleDeleteImage = async (imageName) => {
    const resultAction = await dispatch(
      deleteProductImage({ productId, imageName })
    );
    if (deleteProductImage.fulfilled.match(resultAction)) {
      console.log("Image deleted successfully");
      dispatch(fetchProductById(productId));
    } else {
      console.error("Failed to delete image:", resultAction.error);
    }
  };

  const handleStockChange = (e) => {
    setNewStock(e.target.value);
  };

  const handleStockUpdate = async () => {
    const resultAction = await dispatch(
      updateProductStock({ productId, stock: Number(newStock) })
    );
    if (updateProductStock.fulfilled.match(resultAction)) {
      console.log("Stock updated successfully");
      dispatch(fetchProductById(productId));
    } else {
      console.error("Failed to update stock:", resultAction.error);
    }
  };

  if (status === "loading") {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (status === "failed") {
    return (
      <div className="text-center text-lg text-red-600">Error: {error}</div>
    );
  }

  if (!selectedProduct) {
    return <div className="text-center text-lg">No product found.</div>;
  }

  const images =
    selectedVariant && selectedVariant.image && selectedVariant.image.length > 0
      ? selectedVariant.image.map((img) => `http://localhost:5000/${img}`)
      : selectedProduct.images.map((img) => `http://localhost:5000/${img}`);

  return (
    <>
      <section className="h-screen bg-gray-100 p-4 md:p-8">
        <div className="mb-4">
          <Link to={`/seller/products/update/${productId}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Update Product
            </button>
          </Link>
        </div>
        <div className="mb-4">
          <label className="mr-2">Update Stock:</label>
          <input
            type="number"
            value={newStock}
            onChange={handleStockChange}
            className="border rounded p-2"
          />
          <button
            onClick={handleStockUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ml-2"
          >
            Update Stock
          </button>
        </div>
        <div className="flex flex-col md:flex-row h-full gap-4 ">
          <div className="flex flex-col items-center w-full md:w-1/5 gap-4 overflow-y-auto">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={selectedProduct.name}
                  className="w-full h-32 md:h-48 cursor-pointer p-2 rounded-lg transition-transform transform hover:scale-110 shadow-lg border border-gray-300"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setLightboxOpen(true);
                  }}
                />
                <button
                  onClick={() =>
                    handleDeleteImage(selectedProduct.images[index])
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          {console.log(selectedProduct)}
          <div className="w-full md:w-3/5 flex justify-center items-center">
            <img
              src={images[0]}
              alt={selectedProduct.name}
              className="w-full h-full cursor-pointer object-cover rounded-lg shadow-lg"
              onClick={() => {
                setLightboxOpen(true);
              }}
            />
          </div>
          <div className="w-full md:w-2/5 bg-white p-4 rounded-lg shadow-md ">
            <h1 className="font-bold text-2xl uppercase text-gray-800 mb-2">
              {selectedProduct.name}
            </h1>
            <div className="flex gap-2 items-center mb-2">
              <FaStar size={22} color="yellow" />
              <FaStar size={22} color="yellow" />
              <FaStar size={22} color="yellow" />
              <FaStar size={22} color="yellow" />
              <FaRegStarHalfStroke size={22} color="yellow" />
              <span className="font-semibold text-lg">4.5</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <h1 className="line-through text-lg text-gray-400">
                {selectedVariant && selectedVariant.price
                  ? `$${selectedVariant.price.toFixed(2)}`
                  : selectedProduct && selectedProduct.price
                  ? `$${selectedProduct.price.toFixed(2)}`
                  : "$0.00"}
              </h1>
              <h1 className="text-xl font-bold text-gray-800">
                {selectedVariant && selectedVariant.sellprice
                  ? `$${selectedVariant.sellprice.toFixed(2)}`
                  : selectedProduct && selectedProduct.sellPrice
                  ? `$${selectedProduct.sellPrice.toFixed(2)}`
                  : "$0.00"}
              </h1>
              
            </div>
            <p className="text-gray-600 capitalize mb-4">
              {selectedVariant
                ? selectedVariant.description
                : selectedProduct.description}
            </p>
            {/* {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
              <div className=" pl-5 pt-3 border-t border-gray-400">
                {selectedProduct.variants.map((variant, index) => (
                  <div key={index} className="mb-2 text-gray-800">
                    <div className="flex items-center gap-2">
                      <h1 className="text-gray-600 font-medium">Color -</h1>
                      <div
                        className={`w-4 h-4 rounded-full border-2 cursor-pointer border-black`}
                        style={{ backgroundColor: variant.color }}
                        onClick={() => setSelectedVariant(variant)}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <h1 className="text-gray-600 font-medium">Size -</h1>
                      <div className="bg-red-600 p-2 rounded-lg text-white cursor-pointer">
                        {variant.size}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <h1 className="text-gray-600 font-medium">Price -</h1>
                      <div className="text-gray-800">${variant.price}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <h1 className="text-gray-600 font-medium">Sell Price -</h1>
                      <div className="text-gray-800">${variant.sellPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-600">
                This product doesn't have any variants.
              </p>
            )} */}
            {selectedProduct.status === "pending" ? (
              <h1 className="text-sm text-red-400 py-2">
                * Your product is still in review state; it will be posted after
                the review from the admin,{" "}
                <span className="font-medium">Thank you</span>
              </h1>
            ) : selectedProduct.status === "active" ? (
              <h1 className="text-sm text-green-400 py-2">
                * Your product is currently active and available for sale.
              </h1>
            ) : selectedProduct.status === "rejected" ? (
              <h1 className="text-sm text-red-400 py-2">
                * Your product has been rejected. <br /> Reason:{" "}
                <span className="font-medium">
                  {selectedProduct.rejectedReason}
                </span>
              </h1>
            ) : (
              <h1>Unknown status</h1>
            )}
            <div
              onClick={onAccClick}
              className="py-2 px-3 mb-2 flex group items-center text-gray-700 gap-3 border border-gray-700 cursor-pointer justify-between rounded-lg hover:bg-gray-200 transition"
            >
              See Additional Details Of The Product
              <FaAngleDoubleDown className={`group-hover:animate-bounce`} />
            </div>
            {showAcc && (
              <div className="bg-gray-50 p-2 rounded-lg shadow-sm">
                {" "}
                <div className="py-2 px-3 flex mb-2 items-center text-gray-700 gap-3 border border-gray-700 cursor-pointer justify transition-all duration-700">
                  <h1>Created At: </h1>{" "}
                  <h1>
                    {" "}
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </h1>
                </div>
                <div className="py-2 px-3 flex mb-2 items-center text-gray-700 gap-3 border border-gray-700 cursor-pointer justify transition-all duration-700">
                  <h1>Updated At: </h1>{" "}
                  <h1>
                    {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                  </h1>
                </div>{" "}
                <div className="py-2 px-3 flex  items-center text-gray-700 gap-3 border border-gray-700 cursor-pointer justify transition-all duration-700">
                  <h1>Status: </h1> <h1>{selectedProduct.status}</h1>
                </div>{" "}
              </div>
            )}
          </div>
        </div>
      </section>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((image) => ({ src: image }))}
        index={currentImageIndex}
      />
    </>
  );
};

export default ProductDetails;
