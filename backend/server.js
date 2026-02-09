// backend/server.js
require("dotenv").config(); // ✅ LOAD ENV FIRST

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db"); // mysql2 pool

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS middleware (Local + Production)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman/curl)
      if (!origin) return callback(null, true);

      // ✅ Allow any localhost / 127.0.0.1 port (DEV)
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      // ✅ Allow production origins only
      const allowedOrigins = [
        "https://kiransatyadev1912.github.io",
        "https://kiran-portfolio-fullstack.onrender.com",
      ];

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests
app.options(/.*/, cors());


// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ Health check (used to wake Render from sleep)
app.get("/health", (req, res) => res.status(200).send("OK"));

// ✅ API: Save contact message to MySQL
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, msg: "All fields are required." });
    }

    const sql =
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";

    const [result] = await db.query(sql, [name, email, message]);

    console.log("📩 Saved to DB:", { id: result.insertId, name, email });
    return res.json({ ok: true, msg: "Message sent successfully ✅" });
  } catch (err) {
    console.error("❌ DB insert error:", err.message);
    return res.status(500).json({ ok: false, msg: "Database error" });
  }
});

// ✅ API: Sample profile endpoint
app.get("/api/profile", (req, res) => {
  res.json({
    name: "Kiran",
    role: "Web Developer",
    city: "Vijayawada",
  });
});

// ✅ Serve frontend static files from /docs (for Render)
app.use(express.static(path.join(__dirname, "..", "docs")));

// ✅ Home route (docs/index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "docs", "index.html"));
});

// ✅ Optional: handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, msg: "API route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
