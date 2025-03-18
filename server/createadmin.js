const bcrypt = require("bcrypt");
require("dotenv").config();
const { Client } = require("pg");
const db = new Client({
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();
const createAdmin = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    console.log(`Admin user ${username} created successfully.`);
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    db.end();
  }
};
const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.log("Usage: node createAdmin.js <username> <password>");
  process.exit(1);
}
createAdmin(username, password);
