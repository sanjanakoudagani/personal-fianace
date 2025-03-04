const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    //! Get the token from the header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    //! Verify the token
    const decoded = jwt.verify(token, process.env.sanjanaKey);
    
    //! Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    //! Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = isAuthenticated;
