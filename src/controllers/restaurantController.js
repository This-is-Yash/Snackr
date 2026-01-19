// import bcrypt from "bcryptjs";
// import Restaurant from "../models/Restaurant.js";
// import Menu from "../models/Menu.js";
// import LiveOrder from "../models/LiveOrder.js";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const restaurantDashboard = (req, res) => {
// res.sendFile(path.join(__dirname, "../../public/restaurant.html"));
// };

// export const registerRestaurant = async (req, res) => {
// const { name, email, password, address, type } = req.body;
// const hashed = await bcrypt.hash(password, 10);
// await new Restaurant({ name, email, password: hashed, address, type }).save();
// res.redirect("/restaurant");
// };

// export const loginRestaurant = async (req, res) => {
// const { email, password } = req.body;
// const rest = await Restaurant.findOne({ email });
// if (!rest) return res.send("Restaurant not found");
// const ok = await bcrypt.compare(password, rest.password);
// if (!ok) return res.send("Wrong password");
// req.session.restaurantId = rest._id;
// res.redirect(`/restaurant/${rest._id}/orders`);
// };

// export const addMenuItem = async (req, res) => {
// const { name, price, category } = req.body;
// await new Menu({
// restaurantId: req.params.id,
// name,
// price,
// category,
// }).save();
// res.redirect(`/restaurant/${req.params.id}/orders`);
// };

// export const viewOrders = async (req, res) => {
// const orders = await LiveOrder.find({ restaurantId: req.params.id }).lean();
// res.send(
// orders.length
// ? orders.map((o) => `<div>Order ${o._id} - ${o.status}</div>`).join("")
// : "No orders"
// );
// };

// export const updateOrderStatus = async (req, res) => {
// await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: req.body.status });
// res.redirect(`/restaurant/${req.params.id}/orders`);
// };
const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const bcrypt = require("bcryptjs");

// helper
const sanitize = (str = "") => str.replace(/[<>&"']/g, c => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;"
}[c]));

router.get("/restaurant", (req, res) => {
  res.send(`
    <h2>🏪 Restaurant Portal</h2>
    <form method="POST" action="/register/restaurant">
      <input name="name" placeholder="Name" required><br>
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Register</button>
    </form>
    <form method="POST" action="/login/restaurant">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button>Login</button>
    </form>
  `);
});

router.post("/register/restaurant", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new Restaurant({ name, email, password: hashed }).save();
  res.send("✅ Registered! <a href='/restaurant'>Login</a>");
});

router.post("/login/restaurant", async (req, res) => {
  const { email, password } = req.body;
  const rest = await Restaurant.findOne({ email });
  if (!rest) return res.send("❌ Restaurant not found");
  const ok = await bcrypt.compare(password, rest.password);
  if (!ok) return res.send("❌ Wrong password");
  req.session.restaurantId = rest._id;
  res.redirect(`/restaurant/${rest._id}/menu`);
});

// Manage menu
router.get("/restaurant/:id/menu", async (req, res) => {
  const rest = await Restaurant.findById(req.params.id);
  const menuItems = await Menu.find({ restaurantId: req.params.id });
  const list = menuItems.map(i => `
    <li>${sanitize(i.name)} - ₹${i.price}
      <form style="display:inline" method="POST" action="/restaurant/${req.params.id}/menu/delete/${i._id}">
        <button>Delete</button>
      </form>
    </li>`).join("");
  res.send(`
    <h2>${sanitize(rest.name)} Menu</h2>
    <form method="POST" action="/restaurant/${req.params.id}/menu/add">
      <input name="name" placeholder="Item name" required>
      <input name="price" type="number" placeholder="Price" required>
      <button>Add</button>
    </form>
    <ul>${list}</ul>
    <p><a href="/restaurant/${req.params.id}/orders">View Orders</a></p>
  `);
});

router.post("/restaurant/:id/menu/add", async (req, res) => {
  const { name, price } = req.body;
  await new Menu({ restaurantId: req.params.id, name, price }).save();
  res.redirect(`/restaurant/${req.params.id}/menu`);
});

router.post("/restaurant/:id/menu/delete/:itemId", async (req, res) => {
  await Menu.findByIdAndDelete(req.params.itemId);
  res.redirect(`/restaurant/${req.params.id}/menu`);
});

module.exports = router;
