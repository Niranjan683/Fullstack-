const express = require("express");
const app = express.Router();
const db = require("./db"); // or wherever your MySQL connection is

// Get all privileges for a user
app.get("/api/privileges/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM user_privileges WHERE user_id = ?";
  console.log('prev userid',userId)

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching privileges:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/api/privileges/:userId/:contentId", (req, res) => {
  const { userId, contentId } = req.params;

  const sql = "SELECT can_read, can_update, can_delete FROM user_privileges WHERE user_id = ? AND content_id = ?";
  
  db.query(sql, [userId, contentId], (err, results) => {
    if (err) {
      console.error("Error checking specific privilege:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ can_read: false, can_update: false, can_delete: false }); // No entry means no access
    }

    res.json(results[0]);
  });
});

// Save privileges (insert or update)
app.post("/api/privileges", (req, res) => {
  const privileges = req.body;

  const sql = `
    INSERT INTO user_privileges (user_id, content_id, can_read, can_update, can_delete)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      can_read = VALUES(can_read),
      can_update = VALUES(can_update),
      can_delete = VALUES(can_delete)
  `;

  const tasks = privileges.map(p => {
    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [p.user_id, p.content_id, p.can_read, p.can_update, p.can_delete],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  });

  Promise.all(tasks)
    .then(() => res.json({ message: "Privileges saved successfully" }))
    .catch(err => {
      console.error("Error saving privileges:", err);
      res.status(500).json({ error: "Database error" });
    });
});

module.exports = app;
