require("dotenv").config();
const express = require("express");
const User = require("../../libs/models/users.js");
const bcrypt = require("bcryptjs");
const connectDatabase = require("../../libs/connectDb.js");

const router = express.Router();
const jwt = require("jsonwebtoken");
const AppError = require("../../libs/appError.js");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res,next) => {
  const { name, email, password } = req.body;
  try {
    await connectDatabase();
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return next(new AppError("User Already Exist..",400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email });
    newUser.password = hashedPassword;
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    await connectDatabase();
    const user = await User.findOne({ email: email });
    if (user === null) {
      return next(new AppError("User not found",404));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new AppError("Invalid password",400));
    }
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
      },
    });
  } catch (err) {
    next(err);
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    req.cookies.Date = new Date(0);
    res.json({ message: 'Logged out successfully' });
  });
});
module.exports = router;
