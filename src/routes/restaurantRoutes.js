// // import express from "express";
// // import {
// // registerRestaurant,
// // loginRestaurant,
// // restaurantDashboard,
// // addMenuItem,
// // viewOrders,
// // updateOrderStatus
// // } from "../controllers/restaurantController.js";

// // const router = express.Router();

// // router.get("/", restaurantDashboard);
// // router.post("/register", registerRestaurant);
// // router.post("/login", loginRestaurant);
// // router.post("/:id/menu/add", addMenuItem);
// // router.get("/:id/orders", viewOrders);
// // router.post("/:id/orders/:orderId/update", updateOrderStatus);

// // export default router;
// const express = require("express");
// const router = express.Router();
// const Menu = require("../models/Menu");
// const LiveOrder = require("../models/LiveOrder");
// const Restaurant = require("../models/Restaurant");
// const assignDelivery = require("../utils/assignDelivery");


// // ---------- RESTAURANT MENU ----------
// router.get("/:id/menu", async (req, res) => {
// const restaurant = await Restaurant.findById(req.params.id);
// if (!restaurant) return res.send("❌ Restaurant not found");
// const items = await Menu.find({ restaurantId: req.params.id });

// let html = `

//   <!DOCTYPE html>

//   <html><head>
//   <meta charset="utf-8"><title>${restaurant.name} - Menu</title>
//   <style>
//     body{font-family:Arial;background:#fdf6ec;padding:20px;}
//     h2{color:#e67e22;}
//     form{margin:8px 0;}
//     input,button{padding:8px;margin:4px;border-radius:8px;border:1px solid #ccc;}
//     button{background:#27ae60;color:white;border:none;cursor:pointer;}
//     a{color:#e67e22;text-decoration:none;}
//   </style></head><body>
//     <h2>🍽️ ${restaurant.name} - Manage Menu</h2>
//     <form action="/restaurant/${restaurant._id}/menu/add" method="POST">
//       <input name="name" placeholder="Item Name" required>
//       <input name="price" placeholder="Price" required>
//       <input name="category" placeholder="Category">
//       <button>Add</button>
//     </form>
//     <hr>
//     <ul>${items.map(i => `
//       <li>${i.name} - ₹${i.price} (${i.category})
//         <form style="display:inline" action="/restaurant/${restaurant._id}/menu/delete/${i._id}" method="POST">
//           <button>🗑️</button>
//         </form>
//       </li>`).join("")}</ul>
//     <a href="/restaurant/${restaurant._id}/orders">📦 View Orders</a> | 
//     <a href="/logout">🚪 Logout</a>
//   </body></html>`;
//   res.send(html);
// });

// router.post("/:id/menu/add", async (req, res) => {
// const { name, price, category } = req.body;
// await new Menu({ restaurantId: req.params.id, name, price, category }).save();
// res.redirect(`/restaurant/${req.params.id}/menu`);
// });

// router.post("/:id/menu/delete/:itemId", async (req, res) => {
// await Menu.findByIdAndDelete(req.params.itemId);
// res.redirect(`/restaurant/${req.params.id}/menu`);
// });

// // ---------- RESTAURANT ORDERS ----------
// router.get("/:id/orders", async (req, res) => {
// const restaurantId = req.params.id;
// const orders = await LiveOrder.find({ restaurantId }).sort({ createdAt: -1 }).populate("deliveryPartnerId", "name").lean();

// const html = `

//   <html><head><title>Orders</title>
//   <style>
//   body{font-family:Arial;padding:20px;}
//   .card{border:1px solid #ccc;border-radius:10px;margin:10px;padding:15px;}
//   button{background:#27ae60;color:#fff;border:none;border-radius:6px;padding:6px 12px;margin-top:8px;}
//   </style></head><body>
//   <h2>📦 Live Orders</h2>
//   ${orders.length ? orders.map(o => `
//     <div class="card">
//       <strong>ID:</strong> ${o._id}<br>
//       <strong>User:</strong> ${o.userEmail}<br>
//       <strong>Total:</strong> ₹${o.total.toFixed(2)}<br>
//       <strong>Status:</strong> ${o.status}<br>
//       <ul>${o.items.map(i => `<li>${i.itemName} × ${i.quantity}</li>`).join("")}</ul>
//       ${
//         o.status === "Placed"
//         ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/prepare">
//              <button>Mark Preparing</button>
//            </form>`
//         : o.status === "Preparing"
//         ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/ready">
//              <button>Mark Ready</button>
//            </form>`
//         : `<p>✅ ${o.status}</p>`
//       }
//     </div>
//   `).join("") : "<p>No active orders</p>"}
//   <p><a href="/restaurant/${restaurantId}/menu">⬅ Back</a></p>
//   </body></html>`;
//   res.send(html);
// });

// router.post("/:id/orders/:orderId/prepare", async (req, res) => {
// await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: "Preparing" });
// res.redirect(`/restaurant/${req.params.id}/orders`);
// });

// router.post("/:id/orders/:orderId/ready", async (req, res) => {
// const order = await LiveOrder.findById(req.params.orderId);
// if (!order) return res.send("Order not found");
// order.status = "Ready";
// await order.save();
// await assignDelivery(order);
// res.redirect(`/restaurant/${req.params.id}/orders`);
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const LiveOrder = require("../models/LiveOrder");
const Restaurant = require("../models/Restaurant");
const assignDelivery = require("../utils/assignDelivery");

// ---------- RESTAURANT DASHBOARD (Menu Management) ----------
router.get("/:id/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.send("❌ Restaurant not found");

    const items = await Menu.find({ restaurantId: req.params.id });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${restaurant.name} - Menu Management</title>
      <style>
        body { font-family: Arial, sans-serif; background: #fffaf3; padding: 20px; }
        h2 { color: #e67e22; }
        .menu-form, .item { background: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        input, button { padding: 8px; border-radius: 6px; border: 1px solid #ccc; margin: 4px; }
        button { background: #27ae60; color: white; border: none; cursor: pointer; }
        button:hover { background: #2ecc71; }
        a { color: #e67e22; text-decoration: none; }
        .top-links { margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="top-links">
        <a href="/restaurant/${restaurant._id}/orders">📦 View Orders</a> |
        <a href="/logout">🚪 Logout</a>
      </div>

      <h2>🍽️ ${restaurant.name} — Manage Menu</h2>
      <form class="menu-form" action="/restaurant/${restaurant._id}/menu/add" method="POST">
        <input name="name" placeholder="Item Name" required>
        <input name="price" type="number" step="0.01" placeholder="Price" required>
        <input name="category" placeholder="Category">
        <button type="submit">Add Item ➕</button>
      </form>

      <h3>📋 Current Menu</h3>
      ${
        items.length
          ? items
              .map(
                (i) => `
          <div class="item">
            <strong>${i.name}</strong> — ₹${i.price} <em>(${i.category || "General"})</em>
            <form style="display:inline" action="/restaurant/${restaurant._id}/menu/delete/${i._id}" method="POST">
              <button>🗑️ Delete</button>
            </form>
          </div>`
              )
              .join("")
          : "<p>No items added yet.</p>"
      }
    </body>
    </html>`;
    res.send(html);
  } catch (err) {
    res.send("⚠️ Error loading menu: " + err.message);
  }
});

// Add new item
router.post("/:id/menu/add", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    await new Menu({
      restaurantId: req.params.id,
      name,
      price,
      category,
    }).save();
    res.redirect(`/restaurant/${req.params.id}/menu`);
  } catch (err) {
    res.send("⚠️ Error adding item: " + err.message);
  }
});

// Delete item
router.post("/:id/menu/delete/:itemId", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.itemId);
    res.redirect(`/restaurant/${req.params.id}/menu`);
  } catch (err) {
    res.send("⚠️ Error deleting item: " + err.message);
  }
});

// ---------- RESTAURANT LIVE ORDERS ----------
router.get("/:id/orders", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const orders = await LiveOrder.find({ restaurantId })
      .sort({ createdAt: -1 })
      .populate("deliveryPartnerId", "name email")
      .lean();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Live Orders - ${restaurantId}</title>
      <style>
        body { font-family: Arial; background: #fdf6ec; padding: 20px; }
        h2 { color: #e67e22; }
        .order { background: #fff; padding: 14px; border-radius: 10px; box-shadow: 0 3px 6px rgba(0,0,0,0.05); margin-bottom: 12px; }
        ul { list-style: none; padding: 0; }
        li { padding: 4px 0; }
        button { background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        button:hover { background: #2ecc71; }
        .status { font-weight: bold; color: #e67e22; }
      </style>
    </head>
    <body>
      <h2>📦 Orders Dashboard</h2>
      ${
        orders.length
          ? orders
              .map(
                (o) => `
        <div class="order">
          <div><strong>Order ID:</strong> ${o._id}</div>
          <div><strong>User:</strong> ${o.userEmail}</div>
          <div><strong>Total:</strong> ₹${o.total.toFixed(2)}</div>
          <div class="status">Status: ${o.status}</div>
          <ul>${o.items.map((i) => `<li>${i.itemName} × ${i.quantity}</li>`).join("")}</ul>

          ${
            o.deliveryPartnerId
              ? `<p>🚚 Assigned to: ${o.deliveryPartnerId.name} (${o.deliveryPartnerId.email})</p>`
              : ""
          }

          ${
            o.status === "Placed"
              ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/prepare">
                   <button>Mark as Preparing</button>
                 </form>`
              : o.status === "Preparing"
              ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/ready">
                   <button>Mark Ready for Delivery</button>
                 </form>`
              : o.status === "Out for Delivery"
              ? `<p>🛵 Out for delivery</p>`
              : o.status === "Delivered"
              ? `<p>✅ Delivered</p>`
              : ""
          }
        </div>`
              )
              .join("")
          : "<p>No active orders yet.</p>"
      }
      <p><a href="/restaurant/${restaurantId}/menu">⬅ Back to Menu</a></p>
    </body>
    </html>`;
    res.send(html);
  } catch (err) {
    res.send("⚠️ Error loading orders: " + err.message);
  }
});

// Mark as preparing
router.post("/:id/orders/:orderId/prepare", async (req, res) => {
  try {
    await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: "Preparing" });
    res.redirect(`/restaurant/${req.params.id}/orders`);
  } catch (err) {
    res.send("⚠️ Error updating order: " + err.message);
  }
});

// Mark ready and assign delivery
router.post("/:id/orders/:orderId/ready", async (req, res) => {
  try {
    const order = await LiveOrder.findById(req.params.orderId);
    if (!order) return res.send("❌ Order not found");
    order.status = "Ready";
    await order.save();

    await assignDelivery(order); // 🔥 Delivery assignment

    res.redirect(`/restaurant/${req.params.id}/orders`);
  } catch (err) {
    res.send("⚠️ Error assigning delivery partner: " + err.message);
  }
});

module.exports = router;
