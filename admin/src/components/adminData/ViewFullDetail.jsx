import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiFillCamera } from "react-icons/ai";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaTimes, FaCheck, FaChevronLeft } from "react-icons/fa";
import { updateProfilePic, adminUpdateDetails } from '../../redux/slices/adminSlice';

const ViewFullDetail = ({ onClose }) => {
    const dispatch = useDispatch();
    const [isHovering, setIsHovering] = useState(false);
    const { user } = useSelector((state) => state.admin);
    const [editField, setEditField] = useState(null);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); 
    };

    const handleProfilePicUpdate = (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('profilePic', file);
          dispatch(updateProfilePic(formData));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (field) => {
        await dispatch(adminUpdateDetails({ 
            id: user._id,  
            [field]: formData[field] 
        }));
        setEditField(null);
    };

    const renderField = (field, icon, value) => {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {icon} 
                    {editField === field ? (
                        <input
                            type={field === 'email' ? 'email' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="ml-3 bg-transparent border-b border-indigo-500 focus:outline-none"
                        />
                    ) : (
                        <span className="ml-3">{value}</span>
                    )}
                </div>
                {editField === field ? (
                    <div>
                        <button onClick={() => handleSubmit(field)} className="text-green-500 mr-2">
                            <FaCheck size={20}/>
                        </button>
                        <button onClick={() => setEditField(null)} className="text-red-500">
                            <FaTimes size={20}/>
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setEditField(field)} className="text-indigo-600">
                        <FaEdit size={20}/>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white w-full max-w-sm h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="bg-indigo-600 text-white p-4 flex items-center">
                    <button onClick={handleClose} className="mr-4">
                        <FaChevronLeft className="text-xl" />
                    </button>
                    <h2 className="text-lg font-semibold">Profile</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex items-center mb-6">
                        <div 
                            className="relative mr-4"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <img
                                src={`http://localhost:5000/${user?.profilePic}` || 'https://via.placeholder.com/150'}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            {isHovering && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <label htmlFor="profile-pic-upload" className="cursor-pointer">
                                        <AiFillCamera className="text-white text-xl" />
                                    </label>
                                    <input
                                        id="profile-pic-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePicUpdate}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">Admin</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-base font-semibold">
                        {renderField('name', <FaUser className="text-indigo-600 " size={18}/>, user.name)}
                        {renderField('email', <FaEnvelope className="text-indigo-600 " size={18} />, user.email)}
                        {renderField('phone', <FaPhone className="text-indigo-600 " size={18}/>, user.phone)}
                        <p className="flex items-center">
                            <FaCalendarAlt className="text-indigo-600  mr-3" /> 
                            Joined: {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewFullDetail;
