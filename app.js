const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db");

const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/station");

const { runDetector } = require("./services/detector");

const app = express();

// ===== GLOBAL LOG =====
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.use("/station", stationRoutes);

// ===== HEALTH CHECK (แนะนำ) =====
app.get("/", (req, res) => {
  res.send("🚀 Shuttle Bus API is running");
});

// ===== START SERVER =====
async function start() {
  try {
    // 🔥 connect MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");

    // 🔥 start YOLO detector
    runDetector();
    console.log("🤖 Detector started");

    // 🔥 start server
    const PORT = 5001;

  app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
}

start(); 