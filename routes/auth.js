const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }
    //check for email
    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // check for mobile
    isExistingUser = await User.findOne({ mobile: mobile });
    if (isExistingUser) {
      return res.status(409).json({ message: "Mobile number already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    /*await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });*/

    const userData = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    const userResponse = userData.save();

    const token = await jwt.sign(
      { userId: await userResponse._id },
      process.env.JWT_SECRET
    );

    res.json({ message: "User Registered Sucessfully", token: token });
  } catch (error) {}
});

module.exports = router;
