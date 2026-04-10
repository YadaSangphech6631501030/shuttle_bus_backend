const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db"); // ✅ เพิ่ม

const authRoutes = require("./routes/auth");
const stationRoutes = require("./routes/station");

const { runDetector } = require("./services/detector");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/station", stationRoutes);

// 🔥 แก้ตรงนี้
async function start() {
  await connectDB(); // ✅ ต้องมี

  runDetector(); // YOLO

  app.listen(5000, "0.0.0.0", () => {
    console.log("✅ Server running on port 5000");
  });
}

start();