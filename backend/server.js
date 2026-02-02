// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db"); // ✅ make sure backend/db.js exists

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API: Save contact message to MySQL
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, msg: "All fields are required." });
  }

  const sql =
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("❌ DB insert error:", err);
      return res.status(500).json({ ok: false, msg: "Database error" });
    }

    console.log("📩 Saved to DB:", { id: result.insertId, name, email });
    return res.json({ ok: true, msg: "Message saved successfully ✅" });
  });
});

// ✅ API: Sample profile endpoint
app.get("/api/profile", (req, res) => {
  res.json({
    name: "Kiran",
    role: "Web Developer",
    city: "Vijayawada",
  });
});

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ✅ Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// ✅ Optional: handle 404 for API routes nicely
app.use("/api", (req, res) => {
  res.status(404).json({ ok: false, msg: "API route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
