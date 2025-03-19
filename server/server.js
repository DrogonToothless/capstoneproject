const express = require("express");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();const cookieParser = require("cookie-parser");
app.use(cookieParser());
const PORT = process.env.PORT || 3001;
const { Client } = require("pg");
const db = new Client({ 
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});
db.connect();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};
app.post("/register", async (req, res) => {
  try {
      const { firstname, lastname, email, username, password } = req.body;
      const userExists = await db.query("SELECT * FROM users WHERE username = $1", [username]);
      if (userExists.rows.length > 0) {
          return res.status(400).json({ message: "User already exists" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await db.query(
          "INSERT INTO users (username, password_hash, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)",
          [username, hashedPassword, firstname, lastname, email]
      );
      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({username: user.username,password: user.password_hash}, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      maxAge: 3600000,
      sameSite: 'Strict',
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  res.redirect('/courses');
});
app.post("/adminlogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await db.query("SELECT * FROM admins WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({
      username: user.username, 
      password: user.password_hash,
    }, 
    process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      maxAge: 3600000,
      sameSite: 'Strict',
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  res.redirect('/admin');
});
app.get("/admin/users", async (req, res) => {
  try {
    const users = await db.query("SELECT username, email, first_name, last_name, registered_courses FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
    res.json({ users: result.rows });
  }
});
app.get("/admin/courses", async (req, res) => {
  try {
    const courses = await db.query("SELECT * FROM courses");
    res.json(courses.rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
    res.json({ courses: courses.rows });
  }
});
app.post('/courses', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});
app.post("/courseregister/:courseId", verifyToken, async (req, res) => {
  const { courseId } = req.params;
  const username = req.user.username;
  try {
    const user = await db.query("SELECT registered_courses FROM users WHERE username = $1", [username]);
    let updatedCourses = user.rows[0].registered_courses || [];
    if (!updatedCourses.includes(courseId)) {
      updatedCourses.push(courseId);
      await db.query("UPDATE users SET registered_courses = $1 WHERE username = $2", [updatedCourses, username]);
    }
    res.json({ message: "Course registered successfully!", courses: updatedCourses });
  } catch (err) {
    console.error("Error registering course:", err);
    res.status(500).json({ error: "Failed to register for course" });
  }
});
app.get("/registered-courses", verifyToken, async (req, res) => {
  const username = req.user.username;
  try {
    const result = await db.query("SELECT registered_courses FROM users WHERE username = $1", [username]); // Correct placeholder: $1
    res.json({ courses: result.rows[0].registered_courses || [] });
  } catch (err) {
    console.error("Error fetching registered courses:", err);
    res.status(500).json({ error: "Failed to fetch registered courses" });
  }
});
app.post("/profile", verifyToken, async (req, res) => {
  const username = req.user.username;
  try {
    const result = await db.query("SELECT username, first_name, last_name, email FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        message: `Welcome, ${user.username}`,
        userData: user
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});
app.put("/update-profile", verifyToken, async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const username = req.user.username;
  try {
    await db.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE username = $4",
      [first_name, last_name, email, username]
    );
    res.json({ success: true, message: "Profile updated successfully." });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html')); 
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});