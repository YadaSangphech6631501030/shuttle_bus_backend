const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const DB = "shuttlebus_system";
const COL = "stations";

// ===== STATUS =====
function getStatus(waiting) {
  if (waiting <= 5) return "LOW";
  if (waiting <= 10) return "MEDIUM";
  return "HIGH";
}

// ===== REALISTIC CHANGE =====
function adjustPeople(current) {
  const change = Math.floor(Math.random() * 3) + 1; // 1-3 คน
  const up = Math.random() > 0.5;

  let next = up ? current + change : current - change;

  if (next < 0) next = 0;
  if (next > 10) next = 10;

  return next;
}

// ===== (OPTIONAL) TIME-BASED =====
function adjustPeopleByTime(current) {
  const hour = new Date().getHours();

  let max = 10;

  if (hour >= 8 && hour <= 10) max = 15;   // เช้า
  if (hour >= 17 && hour <= 19) max = 20;  // เย็น

  const change = Math.floor(Math.random() * 3) + 1;
  const up = Math.random() > 0.5;

  let next = up ? current + change : current - change;

  if (next < 0) next = 0;
  if (next > max) next = max;

  return next;
}

// ===== MAIN =====
async function run() {
  await client.connect();

  const db = client.db(DB);
  const col = db.collection(COL);

  console.log("🚀 Fake station started");

  setInterval(async () => {
    try {
      const stations = await col.find({ isReal: false }).toArray();

      for (let s of stations) {
        const current = s.waiting || 0;

        const waiting = adjustPeople(current);

        const status = getStatus(waiting);

        await col.updateOne(
          { id: s.id },
          {
            $set: {
              waiting,
              status,
              updatedAt: new Date(),
            },
          }
        );

        console.log(`📍 ${s.id} → ${current} → ${waiting}`);
      }

      console.log("✅ Updated fake stations\n");
    } catch (err) {
      console.log("❌ Error:", err);
    }
  }, 30000); // 🔥 ทุก 30 วินาที
}

run();