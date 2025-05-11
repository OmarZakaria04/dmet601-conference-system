const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); 
const cors = require("cors");
const dotenv = require("dotenv");
const paperRoutes = require("./routes/papers");
dotenv.config(); 
const app = express();

app.use(cors());
app.use(express.json()); 

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://moustafamsamir:Darsh@cluster0.mongodb.net/conference-system?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Static access to uploaded PDFs
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ⬅️ Important if you're uploading files

// ✅ Paper Submission Routes
app.use("/api/papers", paperRoutes);

// ✅ Serve React Static Files
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Page is running at http://localhost:${PORT}`);
});
