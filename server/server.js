const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const paperRoutes = require("./routes/papers");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // to access uploaded files

// Routes
app.use("/api/papers", paperRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://moustafamsamir:Darsh@cluster0.mongodb.net/conferenceSystem?retryWrites=true&w=majority", {
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
