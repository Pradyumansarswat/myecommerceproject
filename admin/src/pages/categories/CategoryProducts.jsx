import React from "react";
import { useParams } from "react-router-dom";
import ViewCategoryProduct from "../../components/categoriesData/ViewCategoryProduct";

const CategoryProducts = () => {
  const { categoryId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Category Products</h2>
      <ViewCategoryProduct categoryId={categoryId} />
    </div>
  );
};

export default CategoryProducts;
