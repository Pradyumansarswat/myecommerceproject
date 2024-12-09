import axios from "axios";
import React, { useEffect, useState } from "react";
import HomeGraph from "./HomeGraph";

function HomeRep() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSellers, setTotalSellers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [userDates, setUserDates] = useState([]);
  const [sellerDates, setSellerDates] = useState([]);
  const [productDates, setProductDates] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setTotalUsers(response.data.users.length);
        const dates = response.data.users.map((user) =>
          new Date(user.createdAt).toLocaleDateString()
        );
        setUserDates(dates);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      try {
        const response = await axios.get("http://localhost:5000/api/sellers");
        setTotalSellers(response.data.sellers.length);
        const dates = response.data.sellers.map((seller) =>
          new Date(seller.createdAt).toLocaleDateString()
        );
        setSellerDates(dates);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setTotalProducts(response.data.products.length);
        const dates = response.data.products.map((product) =>
          new Date(product.createdAt).toLocaleDateString()
        );
        setProductDates(dates);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <div className="container mx-auto px-4">
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 rounded-md p-4">
            <h1 className="text-white text-xl font-bold text-center">
              Total Users
            </h1>
            <h2 className="text-white text-2xl font-bold text-center mt-2">
              {totalUsers}
            </h2>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-md p-4">
            <h1 className="text-white text-xl font-bold text-center">
              Total Sellers
            </h1>
            <h2 className="text-white text-2xl font-bold text-center mt-2">
              {totalSellers}
            </h2>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-violet-500 rounded-md p-4">
            <h1 className="text-white text-xl font-bold text-center">
              Total Products
            </h1>
            <h2 className="text-white text-2xl font-bold text-center mt-2">
              {totalProducts}
            </h2>
          </div>
        </div>
      </section>
   
    </div>
    <HomeGraph
        totalUsers={totalUsers}
        totalSellers={totalSellers}
        totalProducts={totalProducts}
        userDates={userDates}
        sellerDates={sellerDates}
        productDates={productDates}
      />
    </>
  );
}

export default HomeRep;
