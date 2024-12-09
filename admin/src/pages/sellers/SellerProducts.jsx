import React from "react";
import { useParams } from "react-router-dom";
import ViewSellerProduct from "../../components/sellerData/ViewSellerProduct";

const SellerProducts = () => {
  const { sellerId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Seller Products</h2>
      <ViewSellerProduct sellerId={sellerId} />
    </div>
  );
};

export default SellerProducts;
