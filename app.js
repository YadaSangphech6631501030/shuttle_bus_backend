const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db"); // ✅ เพิ่ม

const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/station");

const { runDetector } = require("./services/detector");

const app = express();

app.use((req, res, next) => {
  console.log("🔥 GLOBAL HIT:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/station", stationRoutes);

// 🔥 แก้ตรงนี้
async function start() {
  await connectDB(); // ✅ ต้องมี

  runDetector(); // YOLO

  app.listen(5001, "0.0.0.0", () => {
    console.log("✅ Server running on port 5001");
  });
}

start();