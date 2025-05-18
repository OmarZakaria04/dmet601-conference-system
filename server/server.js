// At the very top of app.js or index.js
const expectedPackages = [
  "basic-auth",
  "bcryptjs",
  "cors",
  "express",
  "jsonwebtoken",
  "mongoose",
  "multer",
  "nodemailer",
  "nodemon"
];

function checkPackages(packages) {
  const missing = [];
  packages.forEach(pkg => {
    try {
      require.resolve(pkg);
    } catch (e) {
      missing.push(pkg);
    }
  });

  if (missing.length > 0) {
    console.log("⚠️  Missing npm packages detected:");
    missing.forEach(pkg => console.log(` - ${pkg}`));
    console.log("Please run 'npm install' to install the missing packages.\n");
  } else {
    console.log("✅ All expected npm packages are installed.");
  }
}

checkPackages(expectedPackages);
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const paperRoutes = require("./routes/papers");
const assignmentRoutes = require("./routes/assignments");
const reviewerRoutes = require("./routes/reviewers");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const adminRoutes = require('./routes/admin');
const chairDecisionRoutes = require("./routes/chairDecision");
const conferenceRoutes = require('./routes/conferences');
const Conference = require("./models/Conference");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', `http://localhost:${process.env.PORT || 5000}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const userAgent = req.headers['user-agent'] || '';
  const accepts = req.accepts(['html', 'json']);

  const isApiRequest = req.url.startsWith("/api");
  const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent);
  const isHtmlRequest = accepts === 'html';

  // Allow all non-browser clients
  if (!isBrowser) return next();

  // Allow non-API or non-HTML requests
  if (!isApiRequest || !isHtmlRequest) return next();

  // Check allowed sources
  const allowedOrigins = [
    'http://localhost:3000',
    `http://localhost:${process.env.PORT || 5000}`
  ];
  
  const isAllowed = allowedOrigins.some(allowed => 
    origin?.startsWith(allowed) || referer?.startsWith(allowed)
  );

  isAllowed ? next() : res.status(403).json({ 
    message: "🚫 Forbidden: Please use the official interface" 
  });
});


// API routes
app.use("/api/reviewers", reviewerRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/chair-decision", chairDecisionRoutes);
app.use("/api/conferences", conferenceRoutes);


// Auto-create default conference
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

async function ensureCollectionsExist() {
  try {
    const collections = [
      { model: require('./models/AuthorSubmission'), name: "AuthorSubmission", dummy: { title: "temp", abstract: "temp", keywords: [], authors: [], correspondingAuthor: { name: "temp", email: "temp@example.com" }, category: "temp", filePath: "temp", conferenceName: "temp" } },
      { model: require('./models/chairDecision'), name: "chairdecision", dummy: { paperId: new mongoose.Types.ObjectId(), decision: "Approved" } },
      { model: require('./models/Conference'), name: "conferences", dummy: { name: "tempConf", location: "temp", date: new Date(), deadline: new Date(), description: "temp" } },
      { model: require('./models/Reviewer'), name: "reviewers", dummy: { name: "temp", email: `temp${Date.now()}@example.com` } },
      { model: require('./models/submittedReview'), name: "submittedReview", dummy: { paperId: new mongoose.Types.ObjectId(), grade: 5, feedback: "temp" } },
      { model: require('./models/User'), name: "Auth", dummy: { email: `temp${Date.now()}@example.com`, password: "temp", role: "user" } },
    ];

    for (const { model, name, dummy } of collections) {
      const count = await model.countDocuments();
      if (count === 0) {
        const doc = await model.create(dummy);
        await model.deleteOne({ _id: doc._id }); // optional cleanup
        console.log(`📁 '${name}' collection created with dummy doc`);
      } else {
        console.log(`✅ '${name}' collection already exists`);
      }
    }
  } catch (err) {
    console.error("❌ Error ensuring collections:", err);
  }
}



// MongoDB connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb+srv://mostafamsamir:Darsh@webprojectcluster.yd1xmra.mongodb.net/conferenceSystem?retryWrites=true&w=majority&appName=webProjectCluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  autoCreateConference();
  ensureCollectionsExist();
})
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve React frontend
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
