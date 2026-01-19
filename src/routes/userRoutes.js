// import express from "express";
// import { registerUser, loginUser, logoutUser, userDashboard } from "../controllers/userController.js";

// const router = express.Router();

// router.get("/", userDashboard);
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/logout", logoutUser);

// export default router;
const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const LiveOrder = require("../models/LiveOrder");

// View all restaurants
router.get("/restaurants", async (req, res) => {
const list = await Restaurant.find().lean();
const html = `

  <html><head><title>Restaurants</title>
  <style>body{font-family:Arial;padding:20px;}a{color:#e67e22;text-decoration:none;}</style></head>
  <body><h2>🍔 Restaurants</h2>
  <ul>${list.map(r => `<li><a href="/menu/${r._id}">${r.name}</a> - ${r.type}</li>`).join("")}</ul>
  <a href="/cart">🛒 Cart</a> | <a href="/logout">Logout</a>
  </body></html>`;
  res.send(html);
});

// Menu of a restaurant
router.get("/menu/:id", async (req, res) => {
const rest = await Restaurant.findById(req.params.id);
const items = await Menu.find({ restaurantId: req.params.id });
const html = `

  <html><head><title>${rest.name} Menu</title></head>
  <body style="font-family:Arial;padding:20px;">
  <h2>${rest.name} Menu</h2>
  ${items.map(i => `
    <form action="/cart/add" method="POST">
      <input type="hidden" name="restaurantId" value="${rest._id}">
      <input type="hidden" name="itemId" value="${i._id}">
      <input type="hidden" name="itemName" value="${i.name}">
      <input type="hidden" name="price" value="${i.price}">
      ${i.name} - ₹${i.price}
      <input type="number" name="quantity" value="1" min="1">
      <button>Add</button>
    </form>`).join("")}
  <a href="/restaurants">⬅ Back</a>
  </body></html>`;
  res.send(html);
});

// ---------- CART ----------
router.post("/cart/add", (req, res) => {
const { itemId, restaurantId, itemName, price, quantity } = req.body;
if (!req.session.cart) req.session.cart = [];
const existing = req.session.cart.find(i => i.itemId === itemId);
if (existing) existing.quantity += parseInt(quantity);
else req.session.cart.push({ itemId, restaurantId, itemName, price: parseFloat(price), quantity: parseInt(quantity) });
res.redirect("/cart");
});

router.post("/cart/update", (req, res) => {
const { itemId, action } = req.body;
const cart = req.session.cart || [];
const index = cart.findIndex(i => i.itemId === itemId);
if (index > -1) {
if (action === "increase") cart[index].quantity++;
if (action === "decrease") cart[index].quantity = Math.max(1, cart[index].quantity - 1);
if (action === "remove") cart.splice(index, 1);
}
res.redirect("/cart");
});

router.get("/cart", (req, res) => {
const cart = req.session.cart || [];
const total = cart.reduce((a, b) => a + b.price * b.quantity, 0);
const html = `

  <html><head><title>Cart</title></head>
  <body style="font-family:Arial;padding:20px;">
  <h2>Your Cart</h2>
  <ul>${cart.map(i => `
    <li>${i.itemName} x ${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}
      <form action="/cart/update" method="POST" style="display:inline;">
        <input type="hidden" name="itemId" value="${i.itemId}">
        <input type="hidden" name="action" value="increase"><button>+</button>
      </form>
      <form action="/cart/update" method="POST" style="display:inline;">
        <input type="hidden" name="itemId" value="${i.itemId}">
        <input type="hidden" name="action" value="decrease"><button>-</button>
      </form>
      <form action="/cart/update" method="POST" style="display:inline;">
        <input type="hidden" name="itemId" value="${i.itemId}">
        <input type="hidden" name="action" value="remove"><button>🗑️</button>
      </form>
    </li>`).join("")}</ul>
  <h3>Total: ₹${total.toFixed(2)}</h3>
  <form action="/order/confirm" method="POST"><button>Place Order ✅</button></form>
  <a href="/restaurants">⬅ Back</a>
  </body></html>`;
  res.send(html);
});

router.post("/order/confirm", async (req, res) => {
if (!req.session.cart || !req.session.cart.length)
return res.send("Cart empty");
const orders = {};
req.session.cart.forEach(item => {
if (!orders[item.restaurantId]) orders[item.restaurantId] = [];
orders[item.restaurantId].push(item);
});

for (const [restaurantId, items] of Object.entries(orders)) {
const total = items.reduce((a, b) => a + b.price * b.quantity, 0);
await new LiveOrder({
restaurantId,
userEmail: req.session.userEmail || "[guest@snackr.com](mailto:guest@snackr.com)",
items,
total,
status: "Placed",
}).save();
}
req.session.cart = [];
res.send("✅ Orders placed successfully!");
});

module.exports = router;
