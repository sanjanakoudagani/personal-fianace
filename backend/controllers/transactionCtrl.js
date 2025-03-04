const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

const transactionController = {
  //! Add Transaction
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      return res.status(400).json({ message: "Type, amount, and date are required" });
    }

    //! Create Transaction
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      date: date || new Date(), // ✅ Ensure date is saved
      description,
    });

    res.status(201).json(transaction);
  }),

  //! Get Filtered Transactions
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    let filters = { user: req.user };

    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        //! No filter applied for 'All'
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }

    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  }),

  //! Update Transaction
  update: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" }); // ✅ Return 404 if not found
    }

    if (transaction.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update fields
    transaction.type = req.body.type || transaction.type;
    transaction.category = req.body.category || transaction.category;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.date = req.body.date || transaction.date;
    transaction.description = req.body.description || transaction.description;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  }),

  //! Delete Transaction
  delete: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" }); // ✅ Return 404 if not found
    }

    if (transaction.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction removed" });
  }),
};

module.exports = transactionController;
