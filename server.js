require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

// Create Server
const app = express();
app.use(express.json());

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/job", jobRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
