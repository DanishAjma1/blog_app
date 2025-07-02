const express = require("express");
const router = express.Router();
const User = require("../../libs/models/users.js");
const AppError = require("../../libs/appError.js");
const connectDatabase = require("../../libs/connectDb.js");

router.get("/getUsers", async (req, res, next) => {
  try {
    const { email } = req.query;
    await connectDatabase();
    const users = await User.find({ email: { $ne: email } });
    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    return next(new AppError("Failed to fetch users", 500));
  }
});
module.exports = router; 
