const express = require("express");
const transactionController = require("../controllers/transactionCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const transactionRouter = express.Router();

//! Create Transaction
transactionRouter.post("/create", isAuthenticated, transactionController.create);
//! List Transactions
transactionRouter.get("/lists", isAuthenticated, transactionController.getFilteredTransactions);
//! Update Transaction
transactionRouter.put("/update/:id", isAuthenticated, transactionController.update);
//! Delete Transaction
transactionRouter.delete("/delete/:id", isAuthenticated, transactionController.delete);

module.exports = transactionRouter;
