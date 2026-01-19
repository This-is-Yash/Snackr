// // // import express from "express";
// // // import mongoose from "mongoose";
// // // import session from "express-session";
// // // import bodyParser from "body-parser";
// // // import path from "path";
// // // import { fileURLToPath } from "url";

// // // // --- Setup ---
// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);
// // // const app = express();

// // // app.use(bodyParser.urlencoded({ extended: true }));
// // // app.use(express.static(path.join(__dirname, "..", "public")));
// // // app.use(
// // // session({
// // // secret: "snackr-secret",
// // // resave: false,
// // // saveUninitialized: true,
// // // })
// // // );

// // // // --- MongoDB ---
// // // mongoose
// // // .connect("mongodb://localhost:27017/snackr")
// // // .then(() => console.log("✅ MongoDB connected"))
// // // .catch((err) => console.log("❌ MongoDB error:", err.message));

// // // // --- Routes ---
// // // import userRoutes from "./routes/userRoutes.js";
// // // import restaurantRoutes from "./routes/restaurantRoutes.js";
// // // import cartRoutes from "./routes/cartRoutes.js";
// // // import orderRoutes from "./routes/orderRoutes.js";
// // // import deliveryRoutes from "./routes/deliveryRoutes.js";

// // // app.use("/user", userRoutes);
// // // app.use("/restaurant", restaurantRoutes);
// // // app.use("/cart", cartRoutes);
// // // app.use("/order", orderRoutes);
// // // app.use("/delivery", deliveryRoutes);

// // // // --- Home ---
// // // app.get("/", (req, res) => {
// // // res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// // // });

// // // // --- Start server ---
// // // const PORT = 3001;
// // // app.listen(PORT, () => console.log(`🚀 Snackr running at http://localhost:${PORT}`));
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const session = require("express-session");
// // const bodyParser = require("body-parser");
// // const path = require("path");

// // // Controllers
// // const userRoutes = require("./controllers/userController");
// // const restaurantRoutes = require("./controllers/restaurantController");
// // const cartRoutes = require("./controllers/cartController");
// // const orderRoutes = require("./controllers/orderController");

// // const app = express();
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static("public"));

// // app.use(
// //   session({
// //     secret: "snackr-secret",
// //     resave: false,
// //     saveUninitialized: true,
// //   })
// // );

// // // Connect MongoDB
// // mongoose.connect("mongodb://localhost:27017/snackr")
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch(err => console.log("❌ MongoDB Error:", err.message));

// // // Routes
// // app.use("/", userRoutes);
// // app.use("/", restaurantRoutes);
// // app.use("/", cartRoutes);
// // app.use("/", orderRoutes);

// // // Start Server
// // const PORT = process.env.PORT || 3001;
// // app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");

// // Initialize app
// const app = express();

// // Middlewares
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// app.use(
// session({
// secret: "snackr-secret",
// resave: false,
// saveUninitialized: true,
// })
// );



// // MongoDB connection
// mongoose
// .connect("mongodb://localhost:27017/snackr", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.log("❌ DB Connection Error:", err.message));

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const restaurantRoutes = require("./routes/restaurantRoutes");
// const userRoutes = require("./routes/userRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const deliveryRoutes = require("./routes/deliveryRoutes");
// const assignDelivery = require("./utils/assignDelivery");


// app.use("/", authRoutes);
// app.use("/", restaurantRoutes);
// app.use("/", userRoutes);
// app.use("/", cartRoutes);
// app.use("/", orderRoutes);
// app.use("/delivery", deliveryRoutes);



// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`🚀 Snackr running on http://localhost:${PORT}`));
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryPartner = require("../models/DeliveryPartner");
const path = require("path");

// Home
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// USER AUTH
router.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "user.html"));
});

router.post("/register/user", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.send("Provide email & password");
  const hashed = await bcrypt.hash(password, 10);
  await new User({ email, password: hashed }).save();
  res.send("✅ User registered! <a href='/user'>Login</a>");
});

router.post("/login/user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("❌ User not found");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.send("❌ Incorrect password");
  req.session.userEmail = email;
  res.redirect("/restaurants");
});

// RESTAURANT AUTH
router.get("/restaurant", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "restaurant.html"));
});

router.post("/register/restaurant", async (req, res) => {
  const { name, email, password, address, type } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new Restaurant({ name, email, password: hashed, address, type }).save();
  res.send("✅ Restaurant registered! <a href='/restaurant'>Login</a>");
});

router.post("/login/restaurant", async (req, res) => {
  const { email, password } = req.body;
  const rest = await Restaurant.findOne({ email });
  if (!rest) return res.send("❌ Restaurant not found");
  const ok = await bcrypt.compare(password, rest.password);
  if (!ok) return res.send("❌ Wrong password");
  req.session.restaurantId = rest._id.toString();
  res.redirect(`/restaurant/${rest._id}/menu`);
});

// DELIVERY AUTH
router.get("/delivery", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "delivery.html"));
});

router.post("/register/delivery", async (req, res) => {
  const { name, email, password, vehicleNo } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new DeliveryPartner({ name, email, password: hashed, vehicleNo }).save();
  res.send("✅ Delivery Partner Registered! <a href='/delivery'>Login</a>");
});

router.post("/login/delivery", async (req, res) => {
  const { email, password } = req.body;
  const dp = await DeliveryPartner.findOne({ email });
  if (!dp) return res.send("❌ Not found");
  const ok = await bcrypt.compare(password, dp.password);
  if (!ok) return res.send("❌ Wrong password");
  req.session.deliveryEmail = email;
  res.send("🚚 Logged in successfully!");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
