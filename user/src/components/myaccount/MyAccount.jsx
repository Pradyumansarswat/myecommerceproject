import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./MyAccount.css";
import { useNavigate, useParams } from "react-router-dom";

const MyAccount = () => {
  const { section } = useParams();
  const [activeSection, setActiveSection] = useState(section || "profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    image: false,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");

  const [hasChanges, setHasChanges] = useState(false);
  const [editableAddress, setEditableAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setMessage("You must be logged in to access this page.");

      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      fetchUserData(userId);
    }
  }, []);
  useEffect(() => {
    fetchUserData();
    if (activeSection === "address") fetchAddresses();
  }, [activeSection]);

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    if (newSection === "profile") resetEditableFields();
  };

  const fetchUserData = async () => {
    const token = Cookies.get("token");
    if (!token) return setMessage("User not authenticated.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );
      setUserData(response.data);
      // console.log(response);
      if (response.data.profilePic) setImagePreview(response.data.profilePic);
      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setMessage("Error fetching user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setUserData((prevData) => ({ ...prevData, profilePic: file }));
      const filePreview = URL.createObjectURL(file);
      setImagePreview(filePreview);
      setHasChanges(true);

      return () => URL.revokeObjectURL(filePreview);
    }
  };

  const updateProfile = async (e) => {
    const token = Cookies.get("token");
    if (!token) return setMessage("User not authenticated.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    // console.log(userId)
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        {
          name: userData.name,
          email: userData.email,
        }
      );
      if (response.status === 200) {
        setMessage("Profile updated successfully!");

        setUserData((prevData) => ({
          ...prevData,
          name: userData.name,
          email: userData.email,
        }));
        setHasChanges(false);
      }
    } catch (error) {
      setMessage("Failed to update profile.");
    }
  };

  const updateProfilePic = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    const token = Cookies.get("token");
    if (!token) return setMessage("User not authenticated.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    if (file) {
      formData.append("profilePic", file);

      try {
        const response = await axios.post(
          `http://localhost:5000/api/users/update-profile-pic`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setMessage("Profile picture updated successfully!");

          setUserData((prevData) => ({
            ...prevData,
            profilePic: response.data.profilePic,
          }));
          setImagePreview(response.data.profilePic);
        }
      } catch (error) {
        setMessage("Failed to update profile picture.");
      }
    }
  };

  // const updateProfile = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const updatedData = {};
  //   if (isEditable.name) updatedData.name = userData.name;
  //   if (isEditable.email) updatedData.email = userData.email;

  //   try {
  //     const token = Cookies.get("token");
  //     const decodedToken = jwtDecode(token);
  //     const userId = decodedToken.userId;

  //     const formData = new FormData();
  //     if (userData.profilePic)
  //       formData.append("profilePic", userData.profilePic);
  //     Object.keys(updatedData).forEach((key) =>
  //       formData.append(key, updatedData[key])
  //     );

  //     await axios.post(
  //       `http://localhost:5000/api/users/update-profile-pic`,

  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setMessage("Profile updated successfully!");
  //     fetchUserData();
  //     resetEditableFields();
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     setMessage("Failed to update profile. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const toggleEdit = (field) => {
    setIsEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
    if (!isEditable[field]) setHasChanges(true);
  };

  // address

  const fetchAddresses = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) return setMessage("User not authenticated.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/address/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(response);
      setAddresses(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setMessage("Failed to fetch addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    try {
      await axios.post(
        `http://localhost:5000/api/users/address`,
        { ...newAddress, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Address added successfully!");
      setNewAddress({
        houseNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      setMessage("Failed to add address. Please try again.");
    }
  };

  const handleEditAddress = (address) => {
    setEditableAddress(address);
    setNewAddress(address);
  };
  // console.log("editable address", editableAddress._id);
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    try {
      const addressId = editableAddress._id;
      await axios.put(
        `http://localhost:5000/api/users/address/${addressId}`,
        { ...newAddress, userId, addressId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Address updated successfully!");
      setEditableAddress(null);

      fetchAddresses();
      setNewAddress({
        houseNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
    } catch (error) {
      console.error("Error updating address:", error);
      setMessage("Failed to update address. Please try again.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = Cookies.get("token");

    try {
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== addressId)
      );

      await axios.delete(
        `http://localhost:5000/api/users/address/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage("Failed to delete address. Please try again.");

      fetchAddresses();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  // order section

  const fetchOrdersByUserId = async () => {
    const token = Cookies.get("token");
    if (!token) return setMessage("User not authenticated.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    // console.log(userId)

    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}`
      );
      // setOrders(response.data.orders);
      // console.log('order by userid =>',response.data.orders)
      if (response.data.orders.length === 0) {
        setMessage(
          "You haven't ordered anything yet. Please place an order to view details."
        );
      } else {
        setOrders(response.data.orders);
        setMessage("");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("Failed to fetch orders. Please try again.");
    }
  };

  // const fetchOrderByOrderId = async () => {
  //   if (!searchOrderId) return;

  //   setMessage("");

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/orders/ordersdetails/${searchOrderId}`
  //     );

  //     console.log("Response from API:", response.data);

  //     if (response.data.orders && response.data.orders.length > 0) {
  //       const products = response.data.orders[0]?.products;
  //       console.log("Products in order:", products);

  //       if (products && products.length > 0) {
  //         setOrders([response.data.orders]);

  //       } else {
  //         setOrders([]);
  //         setMessage("No products available in this order.");
  //       }
  //     } else {
  //       setOrders([]);
  //       setMessage("Order not found. Please check the Order ID.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching order by Order ID:", error);
  //     setOrders([]);
  //     setMessage("Order not found. Please check the Order ID.");
  //   }
  // };

  const fetchOrderByOrderId = async () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    if (!searchOrderId) {
      setMessage("Please enter an Order ID to search.");
      return;
    }

    setMessage("");
    setOrders([]);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/ordersdetails/${searchOrderId}`
      );

      console.log("Response from API:", response.data);

      if (response.data && response.data.orders) {
        const order = response.data.orders;
        const products = order.products;

        console.log("Products in order:", products);

        if (products && products.length > 0) {
          setOrders([order]);
          // console.log(setOrders)
        } else {
          setMessage("No products available in this order.");
        }
      } else {
        setMessage("Order not found. Please check the Order ID.");
      }
    } catch (error) {
      console.error("Error fetching order by Order ID:", error);

      if (error.response) {
        if (error.response.status === 404) {
          setMessage("Order not found. Please check the Order ID.");
        } else if (error.response.status === 400) {
          setMessage("Invalid Order ID format. Please enter a valid ID.");
        } else {
          setMessage(
            "An error occurred while fetching the order. Please try again later."
          );
        }
      } else if (error.request) {
        setMessage(
          "No response from the server. Please check your network connection."
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }

      setOrders([]);
    }
  };

  // const fetchOrderByOrderId = async () => {
  //   if (!searchOrderId) return;
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/orders/ordersdetails/${searchOrderId}`
  //     );
  //     setOrders([response.data.orders]);
  //     console.log("res by orderId", response.data.orders);
  //   } catch (error) {
  //     console.error("Error fetching order by Order ID:", error);
  //     setMessage("Order not found. Please check the Order ID.");
  //   }
  // };

  const fetchOrdersByDateRange = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setMessage("User not authenticated. Please log in.");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
      // console.log(userId)
    } catch (error) {
      console.error("Invalid or expired token:", error);
      setMessage("Session expired. Please log in again.");
      return;
    }

    if (
      !startDate ||
      !endDate ||
      isNaN(new Date(startDate)) ||
      isNaN(new Date(endDate))
    ) {
      setMessage("Invalid date range provided.");
      return;
    }

    setSearchOrderId("");
    setStatus("");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}/date/${startDate}/${endDate}`
      );

      console.log(response.data);
      if (
        !Array.isArray(response.data.orders) ||
        response.data.orders.length === 0
      ) {
        setMessage("No orders found for the given date range.");
        setOrders([]);
        return;
      }

      setOrders(response.data.orders);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage("You are not authorized to view this data. Please log in.");
      } else if (error.response?.status === 404) {
        setMessage("Orders not found for the given date range.");
      } else {
        console.error("Error fetching orders by date range:", error);
        setMessage("Failed to fetch orders in the specified date range.");
      }
    }
  };

  const fetchOrdersByStatus = async () => {
    const token = Cookies.get("token");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    if (!status) return;
    setSearchOrderId("");
    setStartDate("");
    setEndDate("");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${userId}/status/${status}`
      );
      setOrders(response.data.orders);
      // console.log('res by status', response.data.orders)
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      setMessage("Failed to fetch orders by status.");
    }
  };

  useEffect(() => {
    fetchOrdersByUserId();
  }, []);

  const handleOrderClick = (order) => {
    navigate(`/order-details/${order._id}`);
  };

  const resetEditableFields = () => {
    setIsEditable({ name: false, email: false, image: false });
  };

  return (
    <div className="account-container">
      <div className="account-sidebar">
        <h2>Manage My Account</h2>
        <ul>
          <li
            onClick={() => handleSectionChange("profile")}
            className={activeSection === "profile" ? "active" : ""}
          >
            My Profile
          </li>
          <li
            onClick={() => handleSectionChange("address")}
            className={activeSection === "address" ? "active" : ""}
          >
            Address Book
          </li>
          <li
            onClick={() => handleSectionChange("orders")}
            className={activeSection === "orders" ? "active" : ""}
          >
            My Orders
          </li>
        </ul>
      </div>

      <div className="account-content">
        {loading && <p>Loading...</p>}

        {activeSection === "profile" && (
          <div>
            <h3>Welcome, {userData.name}</h3>
            <form onSubmit={updateProfile} className="profile-form">
              <h2>Edit Your Profile</h2>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  disabled={!isEditable.name}
                />
                <button
                  className="button"
                  type="button"
                  onClick={() => toggleEdit("name")}
                >
                  {isEditable.name ? "Save" : "Edit"}
                </button>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  disabled={!isEditable.email}
                />
                <button
                  className="button"
                  type="button"
                  onClick={() => toggleEdit("email")}
                >
                  {isEditable.email ? "Save" : "Edit"}
                </button>
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditable.image}
                />
                {imagePreview && (
                  <img
                    src={`http://localhost:5000/uploads/${userData.profilePic}`}
                    alt="Preview"
                    style={{ width: "100px" }}
                  />
                )}
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    if (isEditable.image) {
                      updateProfilePic();
                    }
                    toggleEdit("image");
                  }}
                >
                  {isEditable.image ? "Save" : "Edit"}
                </button>
              </div>

              <button className="button" type="submit" disabled={!hasChanges}>
                Update Profile
              </button>
              {/* {message && <p className="message">{message}</p>} */}
            </form>
          </div>
        )}

        {activeSection === "address" && (
          <div className="address-section">
            <h3 className="address-title">Your Addresses</h3>
            <ul className="address-list">
              {addresses.map((address) => (
                <li key={address._id} className="address-item">
                  <p className="address-details">
                    {`${address.houseNumber}, ${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
                  </p>
                  <button
                    className="address-edit-btn"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="address-delete-btn"
                    onClick={() => handleDeleteAddress(address._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <form
              onSubmit={
                editableAddress ? handleUpdateAddress : handleAddAddress
              }
              className="address-form"
            >
              <input
                type="text"
                name="houseNumber"
                value={newAddress.houseNumber}
                onChange={handleInputChange}
                placeholder="House Number"
                required
                className="address-input"
              />
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                placeholder="Street"
                required
                className="address-input"
              />
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                placeholder="City"
                required
                className="address-input"
              />
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                placeholder="State"
                required
                className="address-input"
              />
              <input
                type="text"
                name="zipCode"
                value={newAddress.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                required
                className="address-input"
              />
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
                placeholder="Country"
                required
                className="address-input"
              />
              <button type="submit" className="address-submit-btn">
                {editableAddress ? "Update Address" : "Add Address"}
              </button>
            </form>
          </div>
        )}

        {activeSection === "orders" && (
          <div className="orders-section">
            <h2>My Orders</h2>
            {message && <p>{message}</p>}

            <div className="filters">
              <input
                type="text"
                placeholder="Search by Order ID"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
              <button onClick={fetchOrderByOrderId}>Search</button>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button onClick={fetchOrdersByDateRange}>Filter by Date</button>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={fetchOrdersByStatus}>Filter by Status</button>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Details</th>
                  <th>Status</th>
                  <th>Total Amount (with Delivery)</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  if (
                    !order ||
                    !order.products ||
                    order.products.length === 0
                  ) {
                    return (
                      <tr key={order._id}>
                        <td colSpan="4">Order details are unavailable.</td>
                      </tr>
                    );
                  }

                  const totalAmount = order.products.reduce((acc, product) => {
                    if (!product || !product.productId) return acc;
                    return acc + product.productId.sellPrice * product.quantity;
                  }, 0);

                  const deliveryCharge = totalAmount * 0.02;
                  const totalWithDelivery = totalAmount + deliveryCharge;

                  const firstProduct = order.products[0];
                  const totalQuantity = order.products.reduce(
                    (acc, product) => {
                      return acc + (product?.quantity || 0);
                    },
                    0
                  );

                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {firstProduct?.productId ? (
                          <div style={{ marginBottom: "10px" }}>
                            <p>
                              <strong>Name:</strong>{" "}
                              {firstProduct.productId.name}
                            </p>
                            <img
                              src={`http://localhost:5000/${
                                firstProduct.productId.images?.[0] || ""
                              }`}
                              alt={firstProduct.productId.name}
                              width="50"
                            />
                            <p>
                              <strong>Total Quantity:</strong> {totalQuantity}
                            </p>
                            <button onClick={() => handleOrderClick(order)}>
                              See Full Details
                            </button>
                          </div>
                        ) : (
                          <p>Product details are unavailable.</p>
                        )}
                      </td>
                      <td>{order.status || "N/A"}</td>
                      <td>${totalWithDelivery.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
