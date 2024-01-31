require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Create Server
const app = express();

//connect to db
if (!process.env.MONGODB_URI) {
  console.error("Environment variable MONGODB_URI is not defined");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Db Connected!!"))
  .catch((error) => console.log("Failed to Connect", error));
//health api
app.get("/health", (req, res) => {
  res.json({
    service: "Job listing Server",
    status: "Active",
    time: new Date(),
  });
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
