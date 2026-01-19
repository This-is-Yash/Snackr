const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");

const sanitize = s => String(s || "").replace(/[<>&"']/g, c => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;"
}[c]));

// view restaurants
router.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.send(`
    <h2>🍽 Restaurants</h2>
    ${restaurants.map(r => `
      <div>
        <strong>${sanitize(r.name)}</strong> - ${sanitize(r.address || "")}
        <a href="/menu/${r._id}">View Menu</a>
      </div>`).join("")}
  `);
});

// view menu + add to cart
router.get("/menu/:id", async (req, res) => {
  const rest = await Restaurant.findById(req.params.id);
  const menu = await Menu.find({ restaurantId: req.params.id });
  res.send(`
    <h2>${sanitize(rest.name)} Menu</h2>
    ${menu.map(i => `
      <form method="POST" action="/cart/add">
        ${sanitize(i.name)} - ₹${i.price}
        <input type="hidden" name="restaurantId" value="${rest._id}">
        <input type="hidden" name="itemId" value="${i._id}">
        <input type="hidden" name="itemName" value="${sanitize(i.name)}">
        <input type="hidden" name="price" value="${i.price}">
        <input name="quantity" type="number" value="1" min="1">
        <button>Add to cart</button>
      </form>`).join("")}
    <p><a href="/cart">Go to Cart</a></p>
  `);
});

// add to cart
router.post("/cart/add", (req, res) => {
  const { itemId, restaurantId, itemName, price, quantity } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const item = req.session.cart.find(i => i.itemId === itemId);
  if (item) item.quantity += parseInt(quantity);
  else req.session.cart.push({ itemId, restaurantId, itemName, price: parseFloat(price), quantity: parseInt(quantity) });
  res.redirect("/cart");
});

// edit cart
router.post("/cart/update", (req, res) => {
  const { itemId, action } = req.body;
  const cart = req.session.cart || [];
  const idx = cart.findIndex(i => i.itemId === itemId);
  if (idx === -1) return res.redirect("/cart");
  if (action === "increase") cart[idx].quantity++;
  else if (action === "decrease") {
    cart[idx].quantity--;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
  }
  req.session.cart = cart;
  res.redirect("/cart");
});

// show cart
router.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  res.send(`
    <h2>🛒 Cart</h2>
    ${cart.map(i => `
      <div>
        ${sanitize(i.itemName)} × ${i.quantity} = ₹${i.price * i.quantity}
        <form style="display:inline" method="POST" action="/cart/update">
          <input type="hidden" name="itemId" value="${i.itemId}">
          <input type="hidden" name="action" value="increase"><button>+</button>
        </form>
        <form style="display:inline" method="POST" action="/cart/update">
          <input type="hidden" name="itemId" value="${i.itemId}">
          <input type="hidden" name="action" value="decrease"><button>-</button>
        </form>
      </div>`).join("")}
    <h3>Total: ₹${total}</h3>
    <form method="POST" action="/order/confirm"><button>Place Order</button></form>
  `);
});

module.exports = router;
