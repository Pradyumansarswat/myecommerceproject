import React, { useState } from 'react';
import CategoryList from '../../components/categoriesData/CategoryList';
import CategoryPost from '../../components/categoriesData/CategoryPost';
import CategoryUpdate from '../../components/categoriesData/CategoryUpdate';


const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryAdded = (newCategory) => {
    setCategories(prevCategories => [newCategory, ...prevCategories]);
    setShowAddModal(false);
  };

  const handleUpdateCategory = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(prevCategories => 
      prevCategories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat)
    );
    setShowUpdateModal(false);
  };

  const handleCategoryDeleted = (deletedCategoryId) => {
    setCategories(prevCategories => prevCategories.filter(cat => cat._id !== deletedCategoryId));
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </div>
        <CategoryList 
          categories={categories} 
          setCategories={setCategories} 
          onUpdateCategory={handleUpdateCategory}
          onCategoryDeleted={handleCategoryDeleted}
        />
      </div>
      {showAddModal && (
        <CategoryPost 
          onCategoryAdded={handleCategoryAdded} 
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showUpdateModal && (
        <CategoryUpdate 
          category={selectedCategory}
          onCategoryUpdated={handleCategoryUpdated}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </main>
  );
}

export default Category;
