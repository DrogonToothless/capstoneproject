const express = require("express");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 3001;
const { Pool } = require("pg");
const pool = new Pool({ 
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});
app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied" });
  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html')); 
});
app.post("/register", async (req, res) => {
  try {
      const { firstname, lastname, email, username, password } = req.body;
      const userExists = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (userExists.rows.length > 0) {
          return res.status(400).json({ message: "User already exists" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await pool.query(
          "INSERT INTO users (username, password_hash, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)",
          [username, hashedPassword, firstname, lastname, email]
      );
      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { 
        username: user.username,
        password: user.password_hash
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    res.redirect("/courses");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/adminlogin", authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminExists = await pool.query("SELECT * FROM admins WHERE admin_username = $1", [username]);
    if (adminExists.rows.length > 0) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admin_users (username, password_hash,) VALUES ($1, $2,)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  if (authenticateToken) {
    res.redirect("/admin");
  }
});
app.post("/admin", async (req, res) => {
  res.json({ message: "Admin login successful" });
});
app.post("/courses", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    res.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});