const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
  //! Create Category
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    const normalizedName = name.toLowerCase();
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Invalid category type" });
    }
    const categoryExists = await Category.findOne({ name: normalizedName, user: req.user });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name: normalizedName, user: req.user, type });
    res.status(201).json(category);
  }),

  //! List Categories
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),

  //! Update Category
  update: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { type, name } = req.body;
    const category = await Category.findById(categoryId);
    if (!category || category.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Category not found or unauthorized" });
    }
    category.name = name || category.name;
    category.type = type || category.type;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  }),

  //! Delete Category
  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category || category.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Category not found or unauthorized" });
    }

    //! Update transactions that used this category
    await Transaction.updateMany({ user: req.user, category: category.name }, { $set: { category: "Uncategorized" } });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  }),
};

//! Export the controller
module.exports = categoryController;
