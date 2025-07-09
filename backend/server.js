const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require ("multer")

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "forms_db"
});

//  We’re using memory storage so we can store the image as a BLOB in MySQL directly.


const upload = multer({ storage: multer.memoryStorage() });

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

app.post("/api/users",upload.single("photo"), (req, res) => {  // formData.append("photo", file); -----> Extracts the file, parse it, Puts in side req.file
  // console.log(req)                                             // Meanwhile, text fields like name, email, password go into req.body.
  
  //console.log(req.body) ---> req.body = {name: 'Niranjan',email: 'x@y.com',password: '123'}
  //console.log(req.file) ----> req.file = { fieldname: 'photo', originalname: 'profile.jpg', mimetype: 'image/jpeg', buffer: <Buffer ...>(binary data...)}
  const { name, email, password } = req.body;
  const photo = req.file?.buffer || null;
  const sql = "INSERT INTO users (name, email, user_password, photo) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, password, photo], (err, result) => {
    if (err) return res.status(500).json({error: "database error"});
    res.json({message: "User created successfully"});
  });
});


// getting the data from the DATABASE
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get("/api/users/:id", (req, res) =>{
  const id = req.params.id;
  db.query("SELECT id, name, email FROM users WHERE id= ?", [id], (err, result) =>{
    if (err || result.length ===0){
      return res.status(404).json({error: "User not found"})
    }
    console.log(result);
    res.json(result[0])
  });
});

app.get("/api/users/:id/photo", (req, res) => {
  const id = req.params.id;
  db.query("SELECT photo FROM users WHERE id = ?", [id], (err, result) => {
    if (err || result.length === 0 || !result[0].photo) {
      return res.status(404).send("Image not found");
    }
    console.log("in server res :id/photo " + result)
    res.set("Content-Type", "image/jpeg"); // or image/png
    res.send(result[0].photo);
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
