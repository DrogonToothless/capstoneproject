const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});