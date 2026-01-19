// import LiveOrder from "../models/LiveOrder.js";
// import assignDelivery from "../utils/assignDelivery.js";

// export const confirmOrder = async (req, res) => {
// const cart = req.session.cart || [];
// if (!cart.length) return res.send("🛒 Cart empty");

// const { restaurantId } = req.body;
// const items = cart.filter((i) => i.restaurantId === restaurantId);
// const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

// const order = new LiveOrder({
// userEmail: req.session.userEmail || "[guest@snackr.com](mailto:guest@snackr.com)",
// restaurantId,
// items,
// total,
// status: "Placed",
// });
// await order.save();

// req.session.cart = cart.filter((i) => i.restaurantId !== restaurantId);
// res.send(`✅ Order placed! <a href="/restaurant/${restaurantId}/orders">Track</a>`);
// };

// export const restaurantOrders = async (req, res) => {
// const orders = await LiveOrder.find({ restaurantId: req.params.id })
// .sort({ createdAt: -1 })
// .populate("deliveryPartnerId", "name email");
// res.send(
// orders
// .map(
// (o) => `        <div style="border:1px solid #ccc;padding:8px;margin:5px">           <b>Order:</b> ${o._id} | <b>Status:</b> ${o.status}<br>
//           ${o.items.map((i) =>`${i.itemName} × ${i.quantity}`).join(", ")}<br>
//           ${
//             o.status === "Placed"
//               ? `<form method="POST" action="/order/restaurant/${req.params.id}/${o._id}/update"> <input type="hidden" name="status" value="Preparing"> <button>Mark Preparing</button> </form>`              : o.status === "Preparing"
//               ?`<form method="POST" action="/order/restaurant/${req.params.id}/${o._id}/update"> <input type="hidden" name="status" value="Ready"> <button>Ready for Delivery</button> </form>`
//               : o.status
//           }         </div>`
// )
// .join("")
// );
// };

// export const updateOrderStatus = async (req, res) => {
// const { orderId, id } = req.params;
// const { status } = req.body;
// await LiveOrder.findByIdAndUpdate(orderId, { status });
// if (status === "Ready") {
// const order = await LiveOrder.findById(orderId);
// await assignDelivery(order);
// }
// res.redirect(`/order/restaurant/${id}`);
// };
const express = require("express");
const router = express.Router();
const LiveOrder = require("../models/LiveOrder");
const assignDelivery = require("../utils/assignDelivery");

// confirm order
router.post("/order/confirm", async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.send("🛒 Cart empty!");
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const order = await new LiveOrder({
    userEmail: req.session.userEmail || "guest@snackr.com",
    restaurantId: cart[0].restaurantId,
    items: cart,
    total,
    status: "Placed",
  }).save();

  req.session.cart = [];
  res.send(`✅ Order placed! <a href="/restaurants">Continue</a>`);
});

// restaurant order dashboard
router.get("/restaurant/:id/orders", async (req, res) => {
  const orders = await LiveOrder.find({ restaurantId: req.params.id }).sort({ createdAt: -1 });
  res.send(`
    <h2>📦 Live Orders</h2>
    ${orders.map(o => `
      <div>
        <strong>${o.userEmail}</strong> - ₹${o.total} - ${o.status}
        <form method="POST" action="/restaurant/${req.params.id}/orders/${o._id}/prepare"><button>Mark Preparing</button></form>
      </div>`).join("")}
  `);
});

router.post("/restaurant/:id/orders/:orderId/prepare", async (req, res) => {
  await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: "Preparing" });
  res.redirect(`/restaurant/${req.params.id}/orders`);
});

module.exports = router;
