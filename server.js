require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//create a server
const app = express();

//connect to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));
//health api

app.get("/health", (req, res) => {
  res.json({
    service: "Job listing server",
    status: "active",
    time: new Date(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
