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
        errorMessage: "Bad Request 😵‍💫",
      });
    }
    const isExistingUser = await user.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({ message: "User already exists 👿" });
    }
    isExistingUser = await user.findOne({ mobile: mobile });
    if (isExistingUser) {
      return res
        .status(409)
        .json({ message: "Mobile Number already exists 👿" });
    }
    const hasedPassword = await bcrypt.hashSync(password, 10);
    //this method is the combination to create and save the data
    const userResponse = await User.create({
      name,
      email,
      mobile,
      password: hasedPassword,
    });
    /*
    another method to create and save data is 
    const userData = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    userData.save();
    */
    const token = await jwt.sign(
      { userId: userResponse._id },
      process.env.JWT_SECRET
    );
    res.json({ message: "User registered Sucessfully ✅", token: token });
  } catch (error) {}

  //valid check
  //error handling
  //check if already user exists
  //write into the database
  //create model/schema
  //joi and yup
});

module.export = router;
