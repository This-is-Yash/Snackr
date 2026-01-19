// import bcrypt from "bcryptjs";
// import User from "../models/User.js";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const userDashboard = (req, res) => {
// res.sendFile(path.join(__dirname, "../../public/user.html"));
// };

// export const registerUser = async (req, res) => {
// const { email, password } = req.body;
// if (!email || !password) return res.send("Missing credentials");
// const hashed = await bcrypt.hash(password, 10);
// await new User({ email, password: hashed }).save();
// res.redirect("/user");
// };

// export const loginUser = async (req, res) => {
// const { email, password } = req.body;
// const user = await User.findOne({ email });
// if (!user) return res.send("User not found");
// const ok = await bcrypt.compare(password, user.password);
// if (!ok) return res.send("Wrong password");
// req.session.userEmail = email;
// res.redirect("/restaurant/list");
// };

// export const logoutUser = (req, res) => {
// req.session.destroy(() => res.redirect("/"));
// };
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.get("/user", (req, res) => {
  res.send(`
    <h2>👤 User Portal</h2>
    <form method="POST" action="/register/user">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Register</button>
    </form>
    <form method="POST" action="/login/user">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Login</button>
    </form>
  `);
});

router.post("/register/user", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new User({ email, password: hashed }).save();
  res.send("✅ Registered! <a href='/user'>Login</a>");
});

router.post("/login/user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("❌ User not found");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.send("❌ Wrong password");
  req.session.userEmail = email;
  res.redirect("/restaurants");
});

module.exports = router;
