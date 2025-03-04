const express = require("express");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({ connectionString: process.env.DB_URI });
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../client")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
});
app.get("/login", (req, res) => {
  res.json({ message: "Login" });
});
app.get("/register", (req, res) => {
  res.json({ message: "Register" });
});
app.get("/profile", (req, res) => {
  res.json({ message: "Profile" });
});
app.get("/admin", (req, res) => {
  res.json({ message: "Admin" });
});
app.get("/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses");
    res.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});