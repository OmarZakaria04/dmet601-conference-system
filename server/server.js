const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); 
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://moustafamsamir:Darsh@cluster0.mongodb.net/conference-system?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Page is running at http://localhost:${PORT}`);
});
