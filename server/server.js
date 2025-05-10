const express = require("express");
const path = require("path");

const app = express();

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = 5000;
app.listen(5000, () => {
  console.log(`✅ Page is running at http://localhost:${PORT}`);
});
