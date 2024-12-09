import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsBySellerId } from "../../redux/slices/sellerProductSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const HomeRep = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.sellerProduct);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const sellerId = decodedToken.sellerId;
        if (sellerId) {
          dispatch(fetchAllProductsBySellerId(sellerId));
        } else {
          console.error("Seller ID is undefined");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found");
    }
  }, [dispatch]);

  const countProductsByStatus = () => {
    const counts = {
      active: 0,
      rejected: 0,
      pending: 0,
    };

    products.forEach((product) => {
      if (product.status === "active") {
        counts.active += 1;
      } else if (product.status === "rejected") {
        counts.rejected += 1;
      } else if (product.status === "pending") {
        counts.pending += 1;
      }
    });

    return counts;
  };

  const { active, rejected, pending } = countProductsByStatus();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error loading products.</div>;
  }

  return (
    <>
      <section>
        <div>
          <h1 className="text-3xl font-bold tracking-widest p-2 traking-animation uppercase">
            Summary
          </h1>
        </div>
        <div className="flex justify-around">
          <div className="bg-gradient-to-tr from-red-500 to bg-orange-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">All Products</h1>
            <h2 className="text-center text-xl font-bold py-2">
              {products.length}
            </h2>
          </div>
          <div className="bg-gradient-to-tr from-blue-600 to bg-sky-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">Active Products</h1>
            <h2 className="text-center text-xl font-bold py-2">{active}</h2>
          </div>
          <div className="bg-gradient-to-tr from-violet-600 to bg-purple-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">
              Rejected Products
            </h1>
            <h2 className="text-center text-xl font-bold py-2">{rejected}</h2>
          </div>
          <div className="bg-gradient-to-tr from-green-500 to bg-green-800 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">Pending Products</h1>
            <h2 className="text-center text-xl font-bold py-2">{pending}</h2>
          </div>
        </div>
        <div className="flex justify-around mt-5">
          <div className="bg-gradient-to-tr from-red-500 to bg-orange-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">All Products</h1>
            <h2 className="text-center text-xl font-bold py-2">
              {products.length}
            </h2>
          </div>
          <div className="bg-gradient-to-tr from-blue-600 to bg-sky-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">Active Products</h1>
            <h2 className="text-center text-xl font-bold py-2">{active}</h2>
          </div>
          <div className="bg-gradient-to-tr from-violet-600 to bg-purple-500 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">
              Rejected Products
            </h1>
            <h2 className="text-center text-xl font-bold py-2">{rejected}</h2>
          </div>
          <div className="bg-gradient-to-tr from-green-500 to bg-green-800 p-6 rounded-lg text-white hover:scale-90 duration-300">
            <h1 className="text-center text-2xl font-bold">Pending Products</h1>
            <h2 className="text-center text-xl font-bold py-2">{pending}</h2>
          </div>
        </div>
      </section>
    </>
    // <div>
    //   <h1>Product Summary</h1>
    //   <p>Active Products: {active}</p>
    //   <p>Rejected Products: {rejected}</p>
    //   <p>Pending Products: {pending}</p>
    //   <h2>All Products:</h2>
    //   {products.length}
    // </div>
  );
};

export default HomeRep;
