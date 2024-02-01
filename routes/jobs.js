const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const jwtVerify = require("../middlewares/authMiddleware");

router.post("/create", jwtVerify, async (req, res) => {
  try {
    const { companyName, title, description, logoUrl } = req.body;
    if (!companyName || !title || !description || !logoUrl) {
      return res.status(400).json({ msg: "Missing fields" });
    }
    jobDetails = new Job({
      companyName,
      title,
      description,
      logoUrl,
      refUserId: req.body.userId,
    });

    await jobDetails.save();

    res.json({ message: "New Job Created Sucessfully" });
  } catch (error) {
    console.log("Error in Creating Jobs : ", error);
  }
});

module.exports = router;
