import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProductStatus, getProducts } from '../../redux/slices/productSlice';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProductStatus = ({ status, id, productName, currentPage, limit, filter, searchTerm }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');

  const handleStatusChange = (status) => {
    if (status === 'rejected') {
      setNewStatus(status);
      setShowModal(true);
    } else {
      dispatch(updateProductStatus({ productId: id, newStatus: status, rejectedReason: '' }))
        .unwrap()
        .then((response) => {
          toast.success(`Status updated to ${status}`);
          dispatch(getProducts({ page: currentPage, limit, status: filter, searchTerm }));
        })
        .catch((error) => {
          toast.error(`Failed to update status: ${error}`);
        });
    }
  };

  const handleSubmitRejection = () => {
    if (rejectedReason.trim() === '') {
      toast.error('Please provide a reason for rejection');
      return;
    }
    dispatch(updateProductStatus({ productId: id, newStatus: 'rejected', rejectedReason }))
        .unwrap()
        .then(() => {
            toast.success(`Status updated to rejected`);
            dispatch(getProducts({ page: currentPage, limit, status: filter, searchTerm }));
        })
        .catch((error) => {
            toast.error(`Failed to update status: ${error}`);
        });
    setShowModal(false);
    setRejectedReason('');
  };

  return (
    <>
      <div  className="flex items-center w-full px-4 gap-2 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <button
          onClick={() => handleStatusChange('active')}
          className={`p-2 rounded-full ${
            status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-100'
          }`}
          title="Set as Active"
        >
          <FaCheck />
        </button>
        <button
          onClick={() => handleStatusChange('rejected')}
          className={`p-2 rounded-full ${
            status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-100'
          }`}
          title="Set as Rejected"
        >
          <FaTimes />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Reject Product</h2>
            <p className="mb-4">
              <FaExclamationTriangle className="inline-block mr-2 text-yellow-500" />
              You are about to reject the product: <strong>{productName}</strong>
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="4"
              placeholder="Reason for rejection"
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleSubmitRejection}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductStatus;
