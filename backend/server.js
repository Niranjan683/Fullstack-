const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require ("multer")
const path = require("path")
const app = express();
const bcrypt = require("bcrypt"); // for password hashing
const db = require("./db")
const contentRoutes = require("./contentRoutes")
const privilegesRoutes = require("./privileges")


app.use(cors());
app.use(express.json());
app.use(contentRoutes);
app.use(privilegesRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/profile", express.static("profile"));



//  We’re using memory storage so we can store the image as a BLOB in MySQL directly.


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("multer storage", file)
    if (file.fieldname === "profile") {
      cb(null, "profile");
    } else {
      cb(null, "uploads"); // other images
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueSuffix);
  }
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

//app.use("/uploads", express.static("uploads"));

const upload = multer({ storage});
const multiUpload = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "photos", maxCount: 10 }
]);

// Registration Page API from registration page
app.post("/api/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords is not match." });
  }

  // Check if email already exists
  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ error: "User already registered." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = "INSERT INTO users (name, email, user_password) VALUES (?, ?, ?)";
    db.query(insertSql, [name, email, password], (err2) => {
      if (err2) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Registration successful." });
    });
  });
});

// The API from Log-in Page
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log('mail & password',email,password)

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required." });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found. Please register." });
    }

    const user = results[0];
    console.log(user.id)
    const passwordMatch = password == user.user_password;

    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    // Send basic user info (avoid sending password)
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.user,
      },
    });
  });
});


/* THE API from  UserForm.jsx*/ 
app.post("/api/users", multiUpload, (req, res) => {
  console.log('oiioho')
  const { name, email, password } = req.body;
  const profileImage = req.files?.profile?.[0];
  const otherImages = req.files?.photos || [];

  console.log('request', req);
  console.log("User data:", req.body);
  console.log("Profile:", profileImage?.filename);
  console.log("Other images:", otherImages.map(f => f.filename));

  const insertUserSQL = "INSERT INTO users (name, email, user_password, photo) VALUES (?, ?, ?, ?)";
  const profileFilename = profileImage ? profileImage.filename : null;

  db.query(insertUserSQL, [name, email, password, profileFilename], (err, result) => {
    if (err) {
      console.error("User insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const userId = result.insertId;

    // Insert additional photos if provided
    if (otherImages.length > 0) {
      const photoInsertSQL = "INSERT INTO user_photos (user_id, photo_path) VALUES ?";
      const photoData = otherImages.map(file => [userId, file.filename]);

      db.query(photoInsertSQL, [photoData], (err2) => {
        if (err2) {
          console.error("Photo insert error:", err2);
          return res.status(500).json({ error: "Photo insert error" });
        }
        res.json({ message: "User created with profile + photos" });
      });
    } else {
      res.json({ message: "User created with profile only" });
    }
  });
});



/* The API from AdminPage.jsx to fetch the list of users */
// getting the data from the DATABASE
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
    // console.log(res.json(results))
  });
});


/* the API from ProfilePage */
app.get("/api/users/:id", (req, res) =>{
  const id = req.params.id;
  db.query("SELECT id, name, email, photo FROM users WHERE id= ?", [id], (err, result) =>{
    if (err || result.length ===0){
      return res.status(404).json({error: "User not found"})
    }
    console.log(result);
    res.json(result[0])
  });
});


// this code was used to store the images directly in db 
// app.get("/api/users/:id/photo", (req, res) => {
//   const id = req.params.id;
//   db.query("SELECT photo FROM users WHERE id = ?", [id], (err, result) => {
//     if (err || result.length === 0 || !result[0].photo) {
//       return res.status(404).send("Image not found");
//     }
//     console.log("in server res :id/photo " + result)
//     res.set("Content-Type", "image/jpeg"); // or image/png
//     res.send(result[0].photo);
//   });
// });

/* The update API from AdminPage.jsx */
// app.put("/api/users/:id", upload.array("photoFiles"), (req, res) => {
//   const { name, email, password } = req.body;
//   console.log('req.fiels', req.files.filename)
//   const id = req.params.id;
//   console.log("Update put")

//   const updateUserSql = "UPDATE users SET name = ?, email = ?, user_password = ? WHERE id = ?";
//   db.query(updateUserSql, [name, email, password, id], (err) => {
//     if (err) {
//       console.error("User update error:", err);
//       return res.status(500).send("Error updating user");
//     }
    
//     // Step 1: Update user info
//     if (req.files && req.files.length > 0) {
//       const deletePhotosSql = "DELETE FROM user_photos WHERE user_id = ?";
      
//        db.query(deletePhotosSql, [id], (delErr) => {
//         if (delErr) {
//           console.error("Photo delete error:", delErr);
//           return res.status(500).send("Error deleting old photos");
//         }
        
//         const insertPhotosSql = "INSERT INTO user_photos (photo_path, user_id) VALUES ?";
//         const photoValues = req.files.map(file => [file.filename, userId]);

//         db.query(insertPhotosSql,[photoValues],(insertErr) =>{
//            if (insertErr) {
//             console.error("Photo insert error:", insertErr);
//             return res.status(500).send("Error inserting new photos");
//           }
//           res.send("User and photos updated successfully");

//         });
//       });
//     } else {
//       return res.send("User updated without photos");
//     }  

//   });
// }); 

app.put("/api/users/:id", (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;

  console.log("Updating user info only:", { id, name, email });

  const updateUserSql = "UPDATE users SET name = ?, email = ?, user_password = ? WHERE id = ?";
  db.query(updateUserSql, [name, email, password, id], (err) => {
    if (err) {
      console.error("User update error:", err);
      return res.status(500).send("Error updating user");
    }

    res.send("User updated successfully");
  });
});


app.delete("/api/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("User deleted");
  });
});


// Update the user profile API from the ChangeProfile Picture
app.put(`/api/users/:id/photo`,multiUpload,(req, res)=>{

  console.log("inside upload")
  const userId = req.params.id;
  const profileFile = req.files?.profile?.[0];
  
  if (!profileFile){
    return res.status(400).json({ error: "No profile image uploaded" });
  }

  const newFilename = profileFile.filename;

  const getOld = "SELECT photo FROM users where id =?";
  
  const updateSql = "UPDATE users SET photo = ? WHERE id = ?";
  
  db.query(updateSql, [newFilename, userId], (err2) =>{
    if (err2) return res.status(500).json({ error: "DB update error" })
    res.send("User profile updated successfully");   
    });
  });
    

app.get("/api/user-photos/:id", (req, res) => {
  console.log('Inside /api/user-photos/:id');
  const id = req.params.id;

  db.query("SELECT photo_path FROM user_photos WHERE user_id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No photos found" });
    }

    console.log("Photos from DB:", results);

    const photos = results.map(row => ({
      photo_path: row.photo_path,
      url: `http://localhost:5000/uploads/${row.photo_path}`
    }));

    return res.json(photos); // ✅ Now sends properly after DB query
  });
});

// Delete API from the UserPhots

app.delete("/api/user-photo/:photoId", (req, res) => {
  console.log('in backend api for delete user photo');
  const {photoId} = req.params;
  console.log(photoId)
  // console.log(req);
  const sql = "DELETE FROM user_photos WHERE photo_path= ?";

  db.query(sql, [photoId], (err, result) => {
    if (err) {
      console.error("Failed to delete photo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log('deleted')
    res.json({ message: "Photo deleted successfully" });
  });
});


app.post("/api/user-photos/:id", multiUpload, (req,res) =>{
  console.log(req.params.id);
  const user_id = req.params.id;
  const otherImages = req.files?.photos || [];
  console.log(otherImages)
  if (otherImages.length>0){
    const sql = 'INSERT INTO user_photos (user_id, photo_path) VALUES ?';
    const photoData = otherImages.map(file =>[user_id, file.filename] );

    db.query(sql, [photoData], (err2)=>{
      if (err2){
        console.log("Photo insert Error:", err2);
        return res.status(500).json({error: "Photo Insert Error"});
      }
      res.json({message:"More files are uploaded successfully"});
    });
  }
} );

  app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});

