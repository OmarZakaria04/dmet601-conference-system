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
const adminRoutes = require('./routes/admin'); // Add this line at the top
const chairDecisionRoutes = require("./routes/chairDecision");
const conferenceRoutes = require('./routes/conferences');
const Conference = require("./models/Conference"); // ✅ Import the Conference model

const basicAuth = require("basic-auth");
const authMiddleware = (req, res, next) => {
  const user = basicAuth(req);
  const USERNAME = "root";  
  const PASSWORD = "admin"; 

  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Authentication required.");
  }

  next();
};


app.use(express.json());
app.use(cors());
app.use("/api/reviewers", reviewerRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes); // Add this line to your existing middleware setup
app.use("/api/chair-decision", chairDecisionRoutes);
app.use("/api/conferences", conferenceRoutes); // Add this line to your existing middleware setup
app.use(authMiddleware);
async function autoCreateConference() {
  try {
    const exists = await Conference.findOne({ name: "AI & Robotics 2025" });
    if (!exists) {
      await Conference.create({
        name: "AI & Robotics 2025",
        location: "Berlin",
        date: new Date("2025-09-15"),
        deadline: new Date("2025-07-01"),
        description: "An international conference on AI and Robotics."
      });
      console.log("📌 Default conference created.");
    } else {
      console.log("✅ Default conference already exists.");
    }
  } catch (error) {
    console.error("❌ Error checking/creating conference:", error);
  }
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://mostafamsamir:Darsh@webprojectcluster.yd1xmra.mongodb.net/conferenceSystem?retryWrites=true&w=majority&appName=webProjectCluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  autoCreateConference(); // ✅ Call after DB connects
})
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

