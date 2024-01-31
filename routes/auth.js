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
    let isExistingUser = await User.findOne({ email: email });
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
    const userResponse = await userData.save();

    const token = await jwt.sign(
      { userId: userResponse._id },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User Registered Sucessfully",
      token: token,
      name: name,
    });
  } catch (error) {
    console.log("Error in signup : ", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request!  Invalid Credentials",
      });
    }
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, userDetails.password);
    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }
    const token = await jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User loggedIn  Sucessfully",
      token: token,
      name: userDetails.name,
    });
  } catch (error) {
    console.log("Error in login : ", error);
  }
});

module.exports = router;
