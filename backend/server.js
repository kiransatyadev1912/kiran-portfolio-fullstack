// backend/server.js
require("dotenv").config({ path: __dirname + "/.env" }); // ✅ LOAD ENV FIRST

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db"); // mysql2 pool

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API: Save contact message to MySQL
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, msg: "All fields are required." });
    }

    const sql =
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";

    const [result] = await db.query(sql, [name, email, message]);

    console.log("📩 Saved to DB:", { id: result.insertId, name, email });
    return res.json({ ok: true, msg: "Message saved successfully ✅" });
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

// ✅ Serve frontend static files from /docs
app.use(express.static(path.join(__dirname, "..", "docs")));

// ✅ Home route (IMPORTANT: docs/index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "docs", "index.html"));
});

// ✅ Optional: handle 404 for API routes nicely
app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, msg: "API route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
