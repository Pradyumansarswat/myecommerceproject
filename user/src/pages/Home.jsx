import React from "react";

import MainBanner from "../components/mainbanner/MainBanner";
import FlashSales from "../components/flashsales/FlashSales";
import Category from "../components/category/Category";
import BestSellingProducts from "../components/bestsellingproducts/BestSellingProducts";
import OurProducts from "../components/outproducts/OurProducts";
import FeatureSection from "../components/featuresection/FeatureSection";

const Home = () => {
  return (
    <>
      <MainBanner />
      <FlashSales />
      <Category />
      {/* <BestSellingProducts /> */}
      <OurProducts />
      <FeatureSection />
    </>
  );
};

export default Home;
