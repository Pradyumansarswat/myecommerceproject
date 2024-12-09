import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../../redux/slices/productSlice";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ViewProductDetail = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [showSellerProducts, setShowSellerProducts] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleViewSellerProducts = () => {
    dispatch(getProducts({ sellerId: product.sellerDetails?._id }));
    setShowSellerProducts(true);
  };

  if (!product) {
    return <div>No product data available</div>;
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const categoryNames = product.categoryNames || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:5000/${images[0]}`}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                </div>
              )}
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                    onClick={() => {
                      setCurrentImageIndex(index + 1);
                      setIsLightboxOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${product.price?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-xl text-blue-600 font-semibold mb-2">
                  Selling Price: ${product.sellPrice?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-lg text-gray-600">Status: <span className="font-semibold">{product.status || 'N/A'}</span></p>
                {product.status === 'rejected' && product.rejectReason && (
                  <p className="text-lg text-red-600">Reject Reason: <span className="font-semibold">{product.rejectReason}</span></p>
                )}
                <p className="text-lg text-gray-600">Stock: <span className="font-semibold">{product.stock || 'N/A'}</span></p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.map((category, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Description:</h4>
                <p className="text-gray-600">{product.description || 'No description available'}</p>
              </div>
              {variants.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-2xl font-semibold mb-4 text-gray-800">Variants</h4>
                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={`http://localhost:5000/${variant.image[0]}`} 
                            alt={variant.color} 
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="text-lg font-semibold text-gray-800">
                                {variant.color} {variant.size && `- ${variant.size}`}
                              </h5>
                              <span className="text-sm font-medium text-gray-500">
                                Stock: {variant.stock || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-gray-600">
                                Price: <span className="font-semibold">${variant.price?.toFixed(2) || 'N/A'}</span>
                              </p>
                              <p className="text-blue-600 font-medium">
                                Selling: <span className="font-semibold">${variant.sellPrice?.toFixed(2) || 'N/A'}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold mb-2">Seller Details:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600"><span className="font-semibold">Name:</span> {product.sellerDetails?.name || 'N/A'}</p>
                  <p className="text-gray-600"><span className="font-semibold">Email:</span> {product.sellerDetails?.email || 'N/A'}</p>
                  <p className="text-gray-600"><span className="font-semibold">Phone:</span> {product.sellerDetails?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={images.map(image => ({ src: image }))}
          index={currentImageIndex}
        />
      )}
    </div>
  );
};

export default ViewProductDetail;
