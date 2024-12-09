const Categories = require("../models/CategoriesSchema");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) 
  }
});

const upload = multer({ storage: storage });

const createCategory = async (req, res) => {
  upload.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Error uploading file", error: err });
    } else if (err) {
      return res.status(500).json({ message: "Unknown error", error: err });
    }

    try {
      const { name, description } = req.body;
      const image = req.file ? `uploads/${req.file.filename}` : null; 

      if (!name || !description || !image) {
        return res.status(400).json({
          message: "Name, description, and image are required",
        });
      }

      const newCategory = new Categories({ name, description, image });
      await newCategory.save();

      res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create category",
        error: error.message,
      });
    }
  });
};

const getCategories = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status === 'active' || status === 'inactive') {
      query.status = status;
    }

    const categories = await Categories.find(query);
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  upload.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "Error uploading file", error: err });
    } else if (err) {
      return res.status(500).json({ message: "Unknown error", error: err });
    }

    try {
      const { name, description, status } = req.body;
      const updateData = { name, description, status };
      
      if (req.file) {
        updateData.image = `uploads/${req.file.filename}`; 
      }

      const category = await Categories.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update category",
        error: error.message,
      });
    }
  });
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Categories.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
