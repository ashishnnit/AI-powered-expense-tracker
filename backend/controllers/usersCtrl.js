//! User Registration controller
const asyncHandler = require("express-async-handler");
require("dotenv").config(); // Load environment variables from .env file
const User = require("../model/User"); // Adjust the path as necessary
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For token generation

const userController = {
  //! Registration
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error("Please provide all fields");
    }

    //! Here you would typically check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    //! hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //! Create a new user
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //! Send response
    res.json({
      _id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
    });
  }),

  //! Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide all fields");
    }

    //! Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    //! Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    //! Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Token expiration time
    });

    //! Send response
    res.json({
      message: "Login successful",
      token,
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  }),

  //! Profile
  profile: asyncHandler(async (req, res) => {
    //! Find the user
    console.log(req.user); //! This will log the user ID from the request object
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    //! Send the Response
    res.json({
      username: user.username,
      email: user.email,
    });
  }),

  //! Change Password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    //! hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    //! Resave
    await user.save({
      validateBeforeSave: false,
    });

    //! Send the Response
    res.json({
      message: "Password changed successfully",
    });
  }),

  //! update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User profile updated successfully", updatedUser });
  }),

};

module.exports = userController;
