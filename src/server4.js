const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");

// Assuming models are defined in separate files
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");
const DeliveryPartner = require("./models/DeliveryPartner");
const LiveOrder = require("./models/LiveOrder");

// fallback delivery assignment
async function assignDelivery(order) {
    const partner = await DeliveryPartner.findOne({ status: "Available" });
    if (!partner) return null;
    order.deliveryPartnerId = partner._id;
    order.status = "Out for Delivery";
    await order.save();
    await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "Busy" });
    return partner;
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public"))); // Use external CSS if available

app.use(
    session({
        secret: "snackr-secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
);

mongoose
    .connect("mongodb://127.0.0.1:27017/snackr", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.log("❌ DB Error:", err.message));

// HTML Escaping Utility
function esc(s) {
    return s ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : "";
}

// Basic CSS Styling for better UX
const globalStyle = `
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f7f7f7; color: #333; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
        h2 { color: #e67e22; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0; }
        input, button { padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc; width: 100%; box-sizing: border-box; }
        button { background: #2ecc71; color: white; border: none; cursor: pointer; transition: background 0.3s; }
        button:hover { background: #27ae60; }
        a { color: #e67e22; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
        ul { list-style: none; padding: 0; }
        li { padding: 10px 0; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .item-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .order-action-btn { background: #3498db; width: auto; margin: 0; padding: 8px 12px; }
        .delete-btn { background: #e74c3c; width: auto; margin-left: 10px; }
    </style>
`;
// Function to ensure user is logged in
function ensureUserLoggedIn(req, res, next) {
    if (req.session.userEmail) {
        return next();
    }
    res.send(`<h2>🛑 Access Denied</h2><p>Please <a href='/user'>login</a> to complete your order.</p>`);
}

// ---------- HOME / ROOT ----------
app.get("/", (req, res) => {
    res.send(`
        <html><head><title>Snackr Home</title>${globalStyle}</head>
        <body><div class="container">
            <h2>Welcome to Snackr 🍔</h2>
            <p>Select your user type to get started:</p>
            <ul>
                <li><a href="/user">👤 Customer (Place Orders)</a></li>
                <li><a href="/restaurant">🏪 Restaurant Owner (Manage Menu/Orders)</a></li>
                <li><a href="/delivery">🚚 Delivery Partner (Receive Orders)</a></li>
            </ul>
        </div></body></html>
    `);
});

// ---------- AUTH: USER (Basic UI improvements) ----------
app.get("/user", (req, res) => {
    res.send(`
    <html><head><title>User Auth</title>${globalStyle}</head>
    <body><div class="container">
        <h2>👤 Customer Login / Register</h2>
        <h3>Register</h3>
        <form method="POST" action="/register/user">
          <input name="email" placeholder="Email" type="email" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <hr>
        <h3>Login</h3>
        <form method="POST" action="/login/user">
          <input name="email" placeholder="Email" type="email" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit" style="background: #e67e22;">Login</button>
        </form>
        <p><a href="/">🏠 Home</a></p>
    </div></body></html>`);
});

app.post("/register/user", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        await new User({ email, password: hashed }).save();
        res.send("✅ User registered! <a href='/user'>Login</a>");
    } catch (err) {
        res.send("⚠️ Error: " + err.message);
    }
});

app.post("/login/user", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.send("❌ User not found");
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.send("❌ Wrong password");
        req.session.userEmail = email;
        res.redirect("/restaurants"); // User's main page
    } catch (err) {
        res.send("⚠️ Error: " + err.message);
    }
});

// [ ... RESTAURANT AUTH routes remain similar, using globalStyle ... ]
// Function to ensure user is logged in (copied for context, assume it's global)
/*
function ensureUserLoggedIn(req, res, next) {
    if (req.session.userEmail) {
        return next();
    }
    res.send(`<h2>🛑 Access Denied</h2><p>Please <a href='/user'>login</a> to complete your order.</p>`);
}
*/

// Basic CSS Styling for better UX (copied for context, assume it's global)
const globalStyle = `
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f7f7f7; color: #333; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
        h2 { color: #e67e22; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0; }
        input, button { padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc; width: 100%; box-sizing: border-box; }
        button { background: #2ecc71; color: white; border: none; cursor: pointer; transition: background 0.3s; }
        button:hover { background: #27ae60; }
        a { color: #e67e22; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
        ul { list-style: none; padding: 0; }
        li { padding: 10px 0; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .item-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .order-action-btn { background: #3498db; width: auto; margin: 0; padding: 8px 12px; }
        .delete-btn { background: #e74c3c; width: auto; margin-left: 10px; }
    </style>
`;

// ---------- AUTH: RESTAURANT (Fixed and Improved) ----------
app.get("/restaurant", (req, res) => {
    res.send(`
    <html><head><title>Restaurant Auth</title>${globalStyle}</head>
    <body><div class="container">
        <h2>🏪 Restaurant Login / Register</h2>
        <h3>Register New Restaurant</h3>
        <form method="POST" action="/register/restaurant">
          <input name="name" placeholder="Restaurant Name" required>
          <input name="email" placeholder="Email" type="email" required>
          <input name="password" type="password" placeholder="Password" required>
          <input name="address" placeholder="Address">
          <input name="type" placeholder="Cuisine Type (e.g., Italian, Fast Food)">
          <button type="submit">Register Restaurant</button>
        </form>
        <hr>
        <h3>Login</h3>
        <form method="POST" action="/login/restaurant">
          <input name="email" placeholder="Email" type="email" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit" style="background: #e67e22;">Login</button>
        </form>
        <p><a href="/">🏠 Home</a></p>
    </div></body></html>`);
});

app.post("/register/restaurant", async (req, res) => {
    try {
        const { name, email, password, address, type } = req.body;
        if (!name || !email || !password) return res.send("Provide name, email & password");
        const hashed = await bcrypt.hash(password, 10);
        await new Restaurant({ name, email, password: hashed, address, type }).save();
        res.send("✅ Restaurant registered! <a href='/restaurant'>Login</a>");
    } catch (err) {
        res.send("⚠️ Error: " + err.message);
    }
});

app.post("/login/restaurant", async (req, res) => {
    try {
        const { email, password } = req.body;
        const rest = await Restaurant.findOne({ email });
        if (!rest) return res.send("❌ Restaurant not found");
        const ok = await bcrypt.compare(password, rest.password);
        if (!ok) return res.send("❌ Wrong password");
        req.session.restaurantId = rest._id.toString();
        // Redirect to the dashboard/orders page
        res.redirect(`/restaurant/${rest._id}/orders`);
    } catch (err) {
        res.send("⚠️ Error: " + err.message);
    }
});
// [ ... DELIVERY AUTH routes remain similar, using globalStyle ... ]

// ---------- RESTAURANTS (Improved UI) ----------
app.get("/restaurants", async (req, res) => {
    const rests = await Restaurant.find().lean();
    res.send(`
    <html><head><title>Choose Restaurant</title>${globalStyle}</head>
    <body><div class="container">
        <h2>🍽 Restaurants Near You</h2>
        ${rests
            .map(
                (r) =>
                    `<div class="item-card" style="display:flex; justify-content: space-between; align-items: center;">
                        <div>
                            <b>${esc(r.name)}</b><br>
                            <small>${esc(r.type || "General")} - ${esc(r.address || "No address")}</small>
                        </div>
                        <a href="/menu/${r._id}" class="order-action-btn" style="background:#e67e22;">View Menu</a>
                    </div>`
            )
            .join("")}
        <hr>
        <a href="/cart">🛒 View Cart</a> | <a href="/">🏠 Home</a>
    </div></body></html>`);
});

// ---------- MENU (Improved UI) ----------
app.get("/menu/:id", async (req, res) => {
    try {
        const r = await Restaurant.findById(req.params.id);
        if (!r) return res.send("❌ Restaurant not found");
        const menu = await Menu.find({ restaurantId: r._id }).lean();
        const count = (req.session.cart || []).reduce((s, i) => s + i.quantity, 0);

        res.send(`
        <html><head><title>${esc(r.name)} Menu</title>${globalStyle}</head>
        <body><div class="container">
            <h2>${esc(r.name)} Menu</h2>
            <p>🛒 <a href="/cart">Cart (${count})</a></p>
            ${menu
                .map(
                    (m) => `
                <div style="padding:10px 0; border-bottom: 1px dashed #eee;">
                    <div style="font-weight: bold;">${esc(m.name)} — ₹${m.price.toFixed(2)}</div>
                    <form method="POST" action="/cart/add" style="display:flex; align-items:center; gap: 10px;">
                        <input type="hidden" name="itemId" value="${m._id}">
                        <input type="hidden" name="restaurantId" value="${r._id}">
                        <input type="hidden" name="itemName" value="${esc(m.name)}">
                        <input type="hidden" name="price" value="${m.price}">
                        <input type="number" name="quantity" min="1" value="1" style="width:60px; margin: 0;">
                        <button type="submit" class="order-action-btn" style="width: auto; background: #e67e22;">Add to Cart</button>
                    </form>
                </div>`
                )
                .join("")}
            <hr>
            <p><a href="/restaurants">⬅ Back to Restaurants</a></p>
        </div></body></html>`);
    } catch (err) {
        res.send("⚠️ Error: " + err.message);
    }
});

// [ ... CART ADD / UPDATE remain the same ... ]
app.post("/cart/add", (req, res) => {
    const { itemId, restaurantId, itemName, price, quantity } = req.body;
    if (!req.session.cart) req.session.cart = [];
    const existing = req.session.cart.find((i) => String(i.itemId) === String(itemId)); // Use String comparison
    if (existing) existing.quantity += parseInt(quantity);
    else
        req.session.cart.push({
            itemId,
            restaurantId,
            itemName,
            price: parseFloat(price),
            quantity: parseInt(quantity),
        });
    res.redirect("/cart");
});

app.post("/cart/update", (req, res) => {
    const { itemId, action } = req.body;
    const cart = req.session.cart || [];
    const idx = cart.findIndex((i) => String(i.itemId) === String(itemId)); // Use String comparison
    if (idx !== -1) {
        if (action === "increase") cart[idx].quantity++;
        if (action === "decrease") {
            cart[idx].quantity--;
            if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        }
        if (action === "remove") cart.splice(idx, 1);
    }
    req.session.cart = cart;
    res.redirect("/cart");
});

// ---------- CART (Improved UI) ----------
app.get("/cart", async (req, res) => {
    const cart = req.session.cart || [];
    if (!cart.length)
        return res.send(`
            <html><head><title>Empty Cart</title>${globalStyle}</head>
            <body><div class="container">
                <h2>🛒 Your Cart is Empty</h2>
                <p><a href='/restaurants'>⬅ Browse Restaurants</a></p>
            </div></body></html>
        `);

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    // Fetch restaurant names for display
    const restaurantIds = [...new Set(cart.map(i => i.restaurantId))];
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } }).lean();
    const restMap = new Map(restaurants.map(r => [r._id.toString(), r.name]));

    res.send(`
    <html><head><title>Your Cart</title>${globalStyle}</head>
    <body><div class="container">
        <h2>🛒 Your Order Summary</h2>
        <ul style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #fafafa;">
            ${cart
                .map(
                    (i) => `
                    <li>
                        <div>
                            <b>${esc(i.itemName)}</b> (${esc(restMap.get(i.restaurantId))}) × ${i.quantity} 
                            <span style="font-weight: bold;">— ₹${(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                        <div>
                            <form style="display:inline;" method="POST" action="/cart/update">
                                <input type="hidden" name="itemId" value="${i.itemId}">
                                <button name="action" value="increase" class="order-action-btn">+</button>
                                <button name="action" value="decrease" class="order-action-btn">-</button>
                                <button name="action" value="remove" class="delete-btn">Remove</button>
                            </form>
                        </div>
                    </li>`
                )
                .join("")}
        </ul>
        <h3 style="text-align: right; color: #2ecc71;">Grand Total: ₹${total.toFixed(2)}</h3>
        
        <form method="POST" action="/order/confirm">
            <button type="submit" style="background: #e67e22; margin-top: 15px;">Place Order ✅</button>
        </form>
        
        <hr>
        <p style="display: flex; justify-content: space-between;">
            <a href="/restaurants">⬅ Continue Shopping</a>
            <form style="display:inline" method="POST" action="/cart/clear">
                <button type="submit" class="delete-btn" style="width: auto;">Clear Cart</button>
            </form>
        </p>
    </div></body></html>`);
});

app.post("/cart/clear", (req, res) => {
    req.session.cart = [];
    res.redirect("/cart");
});

// ---------- PLACE ORDER (Improved Flow) ----------
app.post("/order/confirm", ensureUserLoggedIn, async (req, res) => {
    try {
        const cart = req.session.cart || [];
        if (!cart.length) return res.send("Cart empty.");
        
        const placedOrders = [];

        // group by restaurant
        const grouped = {};
        cart.forEach((i) => {
            if (!grouped[i.restaurantId]) grouped[i.restaurantId] = [];
            grouped[i.restaurantId].push(i);
        });

        for (const [rId, items] of Object.entries(grouped)) {
            const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
            const newOrder = await new LiveOrder({
                restaurantId: rId,
                userEmail: req.session.userEmail,
                items,
                total,
                status: "Placed",
            }).save();
            placedOrders.push(newOrder);
        }

        // Store summary in session before clearing cart
        req.session.placedOrdersSummary = placedOrders.map(o => ({
            id: o._id.toString(),
            restaurantId: o.restaurantId,
            total: o.total
        }));

        req.session.cart = [];
        res.redirect("/order-placed"); // Redirect to confirmation page

    } catch (err) {
        res.send("⚠️ Error placing order: " + err.message);
    }
});

// ---------- ORDER PLACED Confirmation Page (New Route) ----------
app.get("/order-placed", async (req, res) => {
    const summary = req.session.placedOrdersSummary || [];
    // Clear the temporary summary immediately
    delete req.session.placedOrdersSummary; 

    if (!summary.length) {
        return res.send(`
            <html><head><title>No Order Found</title>${globalStyle}</head>
            <body><div class="container">
                <h2>🤔 No recent order found.</h2>
                <p><a href="/restaurants">⬅ Start a new order</a></p>
            </div></body></html>
        `);
    }
    
    // Fetch restaurant names for the summary
    const restaurantIds = summary.map(o => o.restaurantId);
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } }).lean();
    const restMap = new Map(restaurants.map(r => [r._id.toString(), r.name]));

    const summaryHtml = summary.map(o => `
        <div class="item-card" style="background: #eafaea; border-color: #2ecc71;">
            <p><strong>Order ID:</strong> ${o.id}</p>
            <p><strong>Restaurant:</strong> ${esc(restMap.get(o.restaurantId) || 'Unknown')}</p>
            <p><strong>Total:</strong> ₹${o.total.toFixed(2)}</p>
        </div>
    `).join('');

    res.send(`
        <html><head><title>Order Placed!</title>${globalStyle}</head>
        <body><div class="container" style="border-top: 5px solid #2ecc71;">
            <h2 style="color: #2ecc71;">🎉 Order${summary.length > 1 ? 's' : ''} Placed!</h2>
            <p>Your order${summary.length > 1 ? 's have' : ' has'} been successfully submitted to the restaurant${summary.length > 1 ? 's' : ''}.</p>
            
            <h3>Summary:</h3>
            ${summaryHtml}

            <hr>
            <a href="/restaurants" class="order-action-btn" style="background: #e67e22; width: 100%; display: block; text-align: center; margin-top: 20px;">
                Continue Shopping (Go to Home)
            </a>
            <p style="margin-top: 10px; text-align: center;">
                <small>You can check the status from your profile later.</small>
            </p>
        </div></body></html>
    `);
});

// [ ... All other RESTAURANT/DELIVERY routes remain the same ... ]
// (These routes will need UI improvements too, but are left for brevity)

// ---------- RESTAURANT DASHBOARD (Simple) ----------
app.get("/restaurant/:id/orders", async (req, res) => {
    // ... [Content of Restaurant Orders Dashboard remains the same] ...
});

// ... [Remaining Restaurant/Delivery POST routes remain the same] ...

// ---------- SERVER ----------
app.listen(3001, () => console.log("🚀 Running on http://localhost:3001"));