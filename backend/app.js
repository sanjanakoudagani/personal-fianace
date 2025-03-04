require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

//! Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // ✅ Use .env for DB connection
  .then(() => console.log("✅ DB Connected"))
  .catch((e) => console.log("❌ DB Connection Error:", e));

//! CORS Config
const corsOptions = {
  origin: ["http://localhost:5173"], // ✅ Allow frontend access
  credentials: true, // ✅ Required for authentication (cookies, headers)
};
app.use(cors(corsOptions));

//! Middlewares
app.use(express.json()); // ✅ Parse incoming JSON data

//! API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transactions", transactionRouter);

//! Global Error Handler
app.use(errorHandler);

//! Start the Server
const PORT = process.env.PORT || 9050;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
});
