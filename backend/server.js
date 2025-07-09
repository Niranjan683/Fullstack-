const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "forms_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, user_password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User added");
  });
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.put("/api/users/:id", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "UPDATE users SET name = ?, email = ?, user_password = ? WHERE id = ?";
  db.query(sql, [name, email, password, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User updated");
  });
});

app.delete("/api/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User deleted");
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
