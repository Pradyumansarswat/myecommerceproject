import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminFromToken } from '../../redux/slices/adminSlice';
import { FaUser, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminFromToken());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500 p-4">Error loading admin details: {message}</p>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {user ? (
        <div className="p-4">
          <div className="flex flex-col items-center mb-4">
            <img
              src={`http://localhost:5000/${user.profilePic}` || 'https://via.placeholder.com/150'}
              alt={user.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-500"
            />
            <h2 className="mt-2 text-xl font-semibold text-gray-800">{user.name}</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <FaEnvelope className="text-indigo-500" />
              <span className="text-sm md:text-base">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3 text-gray-700">
                <FaPhone className="text-indigo-500" />
                <span className="text-sm md:text-base">{user.phone}</span>
              </div>
            )}
            {user.role && (
              <div className="flex items-center space-x-3 text-gray-700">
                <FaUser className="text-indigo-500" />
                <span className="text-sm md:text-base">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 italic p-4">No admin details available.</p>
      )}
    </div>
  );
}

export default AdminProfile;
