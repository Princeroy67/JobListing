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

//Updating Job
router.put("/update/:jobId", jwtVerify, async (req, res) => {
  try {
    const { companyName, title, description, logoUrl } = req.body;
    const jobId = req.params.jobId;
    if (!companyName || !title || !description || !logoUrl || !jobId) {
      return res.status(400).json({ msg: "Missing fields" });
    }
    await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          title,
          description,
          logoUrl,
        },
      }
    );

    res.json({ message: "Job details updated Sucessfully" });
  } catch (error) {
    console.log("Error in Updating Jobs : ", error);
  }
});

//Searching Jobs with the help of JobId

router.get("/job-description/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).json({ msg: "Missing fields" });
    }
    const jobDetails = await Job.findById(jobId, {
      companyName: 1,
      title: 1,
      description: 1,
      createdAt: 1,
    });
    res.json({ data: jobDetails });
  } catch (error) {
    console.log("Error in displaying Job details : ", error);
  }
});
//Get all jobs in this route

router.get("/all", async (req, res) => {
  try {
    const title = req.query.title || " ";
    const skills = req.query.skills;
    const filterSkills = skills?.split(",");
    let filter = {};
    if (filterSkills) {
      filter = { skills: { $in: [...filterSkills] } };
    }
    const jobList = await Job.find(
      {
        title: { $regex: title, $options: "i" },
        ...filter,
      },
      {
        companyName: 1,
        title: 1,
        description: 1,
      }
    );
    res.json({ data: jobList });
  } catch (error) {
    console.log("Error in displaying Jobs : ", error);
  }
});

module.exports = router;
