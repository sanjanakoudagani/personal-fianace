const express = require("express");
const categoryController = require("../controllers/categoryCtrl"); // ✅ Ensure this is correct
const isAuthenticated = require("../middlewares/isAuth");

const categoryRouter = express.Router();

//! Create Category
categoryRouter.post("/create", isAuthenticated, categoryController.create);
//! List Categories
categoryRouter.get("/lists", isAuthenticated, categoryController.lists);
//! Update Category
categoryRouter.put("/update/:categoryId", isAuthenticated, categoryController.update);
//! Delete Category
categoryRouter.delete("/delete/:id", isAuthenticated, categoryController.delete);

module.exports = categoryRouter;
