const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

// Initialize app
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
session({
secret: "snackr-secret",
resave: false,
saveUninitialized: true,
})
);

// MongoDB connection
mongoose
.connect("mongodb://localhost:27017/snackr", {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ DB Connection Error:", err.message));

// Routes
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/", authRoutes);
app.use("/", restaurantRoutes);
app.use("/", userRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);

// Home route
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Snackr running on http://localhost:${PORT}`));
