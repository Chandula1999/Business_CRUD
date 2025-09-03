const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");


dotenv.config({ path: ".env.development" });

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Business CRUD API Server is running!" });
});


app.use("/auth", authRoutes);


app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
