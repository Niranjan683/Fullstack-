// contentRoutes.js
const express = require("express");
const app = express.Router();
const db = require("./db"); // your MySQL connection file

app.post("/api/contents", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const sql = "INSERT INTO contents (title, description) VALUES (?, ?)";
  db.query(sql, [title, description], (err, result) => {
    if (err) {
      console.error("Failed to add content:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Content added successfully", contentId: result.insertId });
  });
});


// GET /api/contents
app.get("/api/contents", (req, res) => {
  const sql = "SELECT * FROM contents ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch contents:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


app.delete("/api/contents/:id", (req, res) => {
  const contentId = req.params.id;
  const sql = "DELETE FROM contents WHERE id = ?";
  db.query(sql, [contentId], (err, result) => {
    if (err) {
      console.error("Failed to delete content:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Content deleted successfully" });
  });
});

// Get single content by ID
app.get("/api/contents/:id", (req, res) => {
  const contentId = req.params.id;

  const sql = "SELECT * FROM contents WHERE id = ?";
  db.query(sql, [contentId], (err, results) => {
    if (err) {
      console.error("Failed to fetch content:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json(results[0]);
  });
});

app.put("/api/contents/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const sql = "UPDATE contents SET title = ?, description = ? WHERE id = ?";
  db.query(sql, [title, description, id], (err, result) => {
    if (err) {
      console.error("Error updating content:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({ message: "Content updated successfully" });
  });
});



module.exports = app;
