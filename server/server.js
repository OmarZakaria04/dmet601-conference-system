const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const paperRoutes = require("./routes/papers");
const app = express();
const assignmentRoutes = require("./routes/assignments");
const reviewerRoutes = require("./routes/reviewers");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");



app.use(express.json());
app.use(cors());
app.use("/api/reviewers", reviewerRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);



// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://mostafamsamir:Darsh@webprojectcluster.yd1xmra.mongodb.net/conferenceSystem?retryWrites=true&w=majority&appName=webProjectCluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
