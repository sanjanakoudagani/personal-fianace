const express = require("express");
const usersController = require("../controllers/usersCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const userRouter = express.Router();

//! Register User
userRouter.post("/register", usersController.register);
//! Login User
userRouter.post("/login", usersController.login);
//! Get User Profile
userRouter.get("/profile", isAuthenticated, usersController.profile);
//! Change Password
userRouter.put("/change-password", isAuthenticated, usersController.changeUserPassword);
//! Update Profile
userRouter.put("/update-profile", isAuthenticated, usersController.updateUserProfile);

module.exports = userRouter;
