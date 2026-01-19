// // const express = require("express");
// // const mongoose = require("mongoose");
// // const session = require("express-session");
// // const bodyParser = require("body-parser");
// // const path = require("path");
// // const bcrypt = require("bcryptjs");

// // // Models
// // const User = require("./models/User");
// // const Restaurant = require("./models/Restaurant");
// // const Menu = require("./models/Menu");
// // const DeliveryPartner = require("./models/DeliveryPartner");
// // const LiveOrder = require("./models/LiveOrder");

// // // Utility: Assign Delivery Partner
// // async function assignDelivery(order) {
// //   const partner = await DeliveryPartner.findOne({ status: "Available" });
// //   if (!partner) return null;
// //   order.deliveryPartnerId = partner._id;
// //   order.status = "Out for Delivery";
// //   await order.save();
// //   await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "Busy" });
// //   return partner;
// // }

// // const app = express();
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static(path.join(__dirname, "public")));
// // app.use(
// //   session({
// //     secret: "snackr-secret",
// //     resave: false,
// //     saveUninitialized: true,
// //   })
// // );

// // mongoose
// //   .connect("mongodb://127.0.0.1:27017/snackr", {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch((err) => console.log("❌ DB Error:", err.message));

// // function esc(s) {
// //   return s ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : "";
// // }

// // // ---------- HOME ----------
// // app.get("/", (req, res) => {
// //   res.send(`
// //   <html>
// //   <head>
// //     <title>Snackr</title>
// //     <style>
// //       body{font-family:Arial;background:#fffaf3;padding:40px;}
// //       h1{color:#e67e22;}
// //       a{display:inline-block;margin:10px 0;color:#fff;background:#e67e22;padding:10px 16px;border-radius:8px;text-decoration:none;}
// //       .box{margin-top:20px;}
// //     </style>
// //   </head>
// //   <body>
// //     <h1>🍔 Welcome to Snackr</h1>
// //     <div class="box">
// //       <a href="/user">👤 User Login</a>
// //       <a href="/restaurant">🏪 Restaurant Login</a>
// //       <a href="/delivery">🚚 Delivery Partner</a>
// //       <a href="/restaurants">🍽 Browse Restaurants</a>
// //       ${req.session.userEmail ? `<a href="/myorders">📦 Your Orders</a>` : ""}
// //       ${req.session.userEmail || req.session.restaurantId || req.session.deliveryId ? 
// //         `<a href="/logout" style="background:#c0392b">🚪 Logout</a>` : ""}
// //     </div>
// //   </body></html>`);
// // });

// // app.get("/logout", (req, res) => {
// //   req.session.destroy(() => res.redirect("/"));
// // });

// // // ---------- USER AUTH ----------
// // app.get("/user", (req, res) => {
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>👤 User Login / Register</h2>
// //     <form method="POST" action="/register/user">
// //       <input name="email" placeholder="Email" required><br>
// //       <input name="password" type="password" placeholder="Password" required><br>
// //       <button type="submit">Register</button>
// //     </form>
// //     <hr>
// //     <form method="POST" action="/login/user">
// //       <input name="email" placeholder="Email" required><br>
// //       <input name="password" type="password" placeholder="Password" required><br>
// //       <button type="submit">Login</button>
// //     </form>
// //     <a href="/">⬅ Home</a>
// //   </body></html>`);
// // });

// // app.post("/register/user", async (req, res) => {
// //   const { email, password } = req.body;
// //   const hashed = await bcrypt.hash(password, 10);
// //   await new User({ email, password: hashed }).save();
// //   res.send("✅ Registered! <a href='/user'>Login</a>");
// // });

// // app.post("/login/user", async (req, res) => {
// //   const { email, password } = req.body;
// //   const user = await User.findOne({ email });
// //   if (!user) return res.send("❌ User not found");
// //   const ok = await bcrypt.compare(password, user.password);
// //   if (!ok) return res.send("❌ Wrong password");
// //   req.session.userEmail = email;
// //   res.redirect("/restaurants");
// // });

// // // ---------- RESTAURANT AUTH ----------
// // app.get("/restaurant", (req, res) => {
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>🏪 Restaurant Login / Register</h2>
// //     <form method="POST" action="/register/restaurant">
// //       <input name="name" placeholder="Name" required><br>
// //       <input name="email" placeholder="Email" required><br>
// //       <input type="password" name="password" placeholder="Password" required><br>
// //       <input name="address" placeholder="Address"><br>
// //       <input name="type" placeholder="Cuisine Type"><br>
// //       <button type="submit">Register</button>
// //     </form>
// //     <hr>
// //     <form method="POST" action="/login/restaurant">
// //       <input name="email" placeholder="Email" required><br>
// //       <input type="password" name="password" placeholder="Password" required><br>
// //       <button>Login</button>
// //     </form>
// //     <a href="/">⬅ Home</a>
// //   </body></html>`);
// // });

// // app.post("/register/restaurant", async (req, res) => {
// //   const { name, email, password, address, type } = req.body;
// //   const hashed = await bcrypt.hash(password, 10);
// //   await new Restaurant({ name, email, password: hashed, address, type }).save();
// //   res.send("✅ Registered! <a href='/restaurant'>Login</a>");
// // });

// // app.post("/login/restaurant", async (req, res) => {
// //   const { email, password } = req.body;
// //   const rest = await Restaurant.findOne({ email });
// //   if (!rest) return res.send("❌ Restaurant not found");
// //   const ok = await bcrypt.compare(password, rest.password);
// //   if (!ok) return res.send("❌ Wrong password");
// //   req.session.restaurantId = rest._id.toString();
// //   res.redirect(`/restaurant/${rest._id}/dashboard`);
// // });

// // // ---------- RESTAURANT DASHBOARD ----------
// // app.get("/restaurant/:id/dashboard", async (req, res) => {
// //   const r = await Restaurant.findById(req.params.id);
// //   const menu = await Menu.find({ restaurantId: r._id });
// //   const orders = await LiveOrder.find({ restaurantId: r._id }).sort({ createdAt: -1 }).lean();

// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>🏪 ${esc(r.name)} Dashboard</h2>
// //     <a href="/logout">🚪 Logout</a>
// //     <hr>
// //     <h3>📋 Menu</h3>
// //     <form method="POST" action="/restaurant/${r._id}/menu/add">
// //       <input name="name" placeholder="Item" required>
// //       <input name="price" placeholder="Price" required>
// //       <input name="category" placeholder="Category">
// //       <button>Add</button>
// //     </form>
// //     <ul>${menu.map(m=>`<li>${esc(m.name)} - ₹${m.price} (${m.category||'General'}) 
// //     <form style="display:inline" method="POST" action="/restaurant/${r._id}/menu/delete/${m._id}">
// //     <button>🗑️</button></form></li>`).join("")}</ul>

// //     <hr>
// //     <h3>📦 Live Orders</h3>
// //     ${orders.length ? orders.map(o=>`
// //       <div style="border:1px solid #ddd;padding:10px;margin:10px 0;border-radius:6px">
// //         <b>Order:</b> ${o._id}<br>
// //         <b>User:</b> ${esc(o.userEmail)}<br>
// //         <b>Status:</b> ${esc(o.status)}<br>
// //         <ul>${o.items.map(i=>`<li>${esc(i.itemName)} × ${i.quantity}</li>`).join("")}</ul>
// //         ${o.status==="Placed"?
// //           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/accept"><button>Accept</button></form>`:
// //           o.status==="Accepted"?
// //           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/prepare"><button>Preparing</button></form>`:
// //           o.status==="Preparing"?
// //           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/ready"><button>Mark Ready</button></form>`:
// //           o.status==="Out for Delivery"?"🚚 Out for delivery":
// //           o.status==="Delivered"?"✅ Delivered":""}
// //       </div>
// //     `).join(""):"<p>No current orders</p>"}
// //   </body></html>`);
// // });

// // app.post("/restaurant/:id/menu/add", async (req,res)=>{
// //   const {name,price,category}=req.body;
// //   await new Menu({restaurantId:req.params.id,name,price,category}).save();
// //   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// // });

// // app.post("/restaurant/:id/menu/delete/:itemId", async(req,res)=>{
// //   await Menu.findByIdAndDelete(req.params.itemId);
// //   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// // });

// // app.post("/restaurant/:id/orders/:orderId/:action", async (req,res)=>{
// //   const {action}=req.params;
// //   const order=await LiveOrder.findById(req.params.orderId);
// //   if(!order)return res.send("Order not found");
// //   if(action==="accept")order.status="Accepted";
// //   if(action==="prepare")order.status="Preparing";
// //   if(action==="ready"){order.status="Ready";await assignDelivery(order);}
// //   await order.save();
// //   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// // });

// // // ---------- USER RESTAURANTS & MENU ----------
// // app.get("/restaurants", async (req, res) => {
// //   const rests = await Restaurant.find().lean();
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>🍽 Choose Restaurant</h2>
// //     ${rests.map(r=>`<div><b>${esc(r.name)}</b> (${esc(r.type||'General')})
// //     <a href="/menu/${r._id}">View Menu</a></div>`).join("")}
// //     <a href="/">⬅ Home</a>
// //   </body></html>`);
// // });

// // app.get("/menu/:id", async (req,res)=>{
// //   const r=await Restaurant.findById(req.params.id);
// //   const menu=await Menu.find({restaurantId:r._id});
// //   const count=(req.session.cart||[]).reduce((s,i)=>s+i.quantity,0);
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>${esc(r.name)} Menu</h2>
// //     <a href="/cart">🛒 Cart (${count})</a><hr>
// //     ${menu.map(m=>`
// //       <div style="margin:8px 0">
// //         <b>${esc(m.name)}</b> ₹${m.price}
// //         <form method="POST" action="/cart/add" style="display:inline">
// //           <input type="hidden" name="restaurantId" value="${r._id}">
// //           <input type="hidden" name="itemId" value="${m._id}">
// //           <input type="hidden" name="itemName" value="${esc(m.name)}">
// //           <input type="hidden" name="price" value="${m.price}">
// //           <input type="number" name="quantity" min="1" value="1" style="width:60px">
// //           <button>Add</button>
// //         </form>
// //       </div>`).join("")}
// //     <a href="/restaurants">⬅ Back</a>
// //   </body></html>`);
// // });

// // // ---------- CART ----------
// // app.post("/cart/add",(req,res)=>{
// //   const {itemId,restaurantId,itemName,price,quantity}=req.body;
// //   if(!req.session.cart)req.session.cart=[];
// //   const existing=req.session.cart.find(i=>i.itemId===itemId);
// //   if(existing)existing.quantity+=parseInt(quantity);
// //   else req.session.cart.push({itemId,restaurantId,itemName,price:parseFloat(price),quantity:parseInt(quantity)});
// //   res.redirect("/cart");
// // });

// // app.get("/cart",(req,res)=>{
// //   const cart=req.session.cart||[];
// //   if(!cart.length)return res.send("<h3>Empty cart</h3><a href='/restaurants'>Back</a>");
// //   const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>🛒 Your Cart</h2>
// //     ${cart.map(i=>`
// //       <div>${esc(i.itemName)} × ${i.quantity} — ₹${i.price*i.quantity}
// //         <form method="POST" action="/cart/update" style="display:inline">
// //           <input type="hidden" name="itemId" value="${i.itemId}">
// //           <button name="action" value="increase">+</button>
// //           <button name="action" value="decrease">-</button>
// //         </form>
// //       </div>`).join("")}
// //     <h3>Total: ₹${total}</h3>
// //     <form method="POST" action="/order/confirm"><button>Place Order</button></form>
// //   </body></html>`);
// // });

// // app.post("/cart/update",(req,res)=>{
// //   const {itemId,action}=req.body;
// //   const cart=req.session.cart||[];
// //   const i=cart.find(c=>c.itemId===itemId);
// //   if(!i)return res.redirect("/cart");
// //   if(action==="increase")i.quantity++;
// //   if(action==="decrease")i.quantity--;
// //   if(i.quantity<=0)req.session.cart=cart.filter(c=>c.itemId!==itemId);
// //   res.redirect("/cart");
// // });

// // // ---------- PLACE ORDER ----------
// // app.post("/order/confirm",async(req,res)=>{
// //   const cart=req.session.cart||[];
// //   if(!cart.length)return res.send("Cart empty");
// //   const grouped={};
// //   cart.forEach(i=>{
// //     if(!grouped[i.restaurantId])grouped[i.restaurantId]=[];
// //     grouped[i.restaurantId].push(i);
// //   });
// //   for(const[rId,items]of Object.entries(grouped)){
// //     const total=items.reduce((s,i)=>s+i.price*i.quantity,0);
// //     await new LiveOrder({restaurantId:rId,userEmail:req.session.userEmail||"guest",items,total,status:"Placed"}).save();
// //   }
// //   req.session.cart=[];
// //   res.send("<h2>✅ Order Placed Successfully!</h2><a href='/myorders'>📦 View Your Orders</a>");
// // });

// // // ---------- USER ORDER HISTORY ----------
// // app.get("/myorders",async(req,res)=>{
// //   const email=req.session.userEmail;
// //   if(!email)return res.redirect("/user");
// //   const orders=await LiveOrder.find({userEmail:email}).sort({createdAt:-1}).lean();
// //   res.send(`
// //   <html><body style="font-family:Arial;padding:40px">
// //     <h2>📦 Your Orders</h2>
// //     ${orders.length?orders.map(o=>`
// //       <div style="border:1px solid #ddd;padding:10px;margin:10px 0;border-radius:8px">
// //         <b>Status:</b> ${esc(o.status)}<br>
// //         <b>Total:</b> ₹${o.total}<br>
// //         <ul>${o.items.map(i=>`<li>${esc(i.itemName)} × ${i.quantity}</li>`).join("")}</ul>
// //       </div>`).join(""):"<p>No orders yet.</p>"}
// //     <a href="/">⬅ Home</a>
// //   </body></html>`);
// // });

// // // ---------- SERVER ----------
// // app.listen(3001,()=>console.log("🚀 Snackr running on http://localhost:3001"));
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");
// const bcrypt = require("bcryptjs");

// // Models
// const User = require("./models/User");
// const Restaurant = require("./models/Restaurant");
// const Menu = require("./models/Menu");
// const DeliveryPartner = require("./models/DeliveryPartner");
// const LiveOrder = require("./models/LiveOrder");

// // Utility: Assign Delivery Partner
// async function assignDelivery(order) {
//   const partner = await DeliveryPartner.findOne({ status: "Available" });
//   if (!partner) return null;
//   order.deliveryPartnerId = partner._id;
//   order.status = "Out for Delivery";
//   await order.save();
//   await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "Busy" });
//   return partner;
// }

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   session({
//     secret: "snackr-secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// mongoose
//   .connect("mongodb://127.0.0.1:27017/snackr", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ DB Error:", err.message));

// function esc(s) {
//   return s
//     ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]))
//     : "";
// }

// // ---------- GLOBAL STYLE TEMPLATE ----------
// function layout(title, content, req) {
//   return `
//   <html>
//   <head>
//     <title>${title}</title>
//     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
//     <style>
//       body {
//         font-family: 'Inter', sans-serif;
//         background: #fafafa;
//         margin: 0;
//         color: #333;
//       }
//       header {
//         background: #e67e22;
//         color: white;
//         padding: 12px 20px;
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//       }
//       header a {
//         color: white;
//         text-decoration: none;
//         margin-left: 15px;
//         font-weight: 500;
//       }
//       main {
//         max-width: 900px;
//         margin: 40px auto;
//         background: white;
//         padding: 30px;
//         border-radius: 12px;
//         box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//       }
//       h1, h2, h3 {
//         color: #e67e22;
//       }
//       form {
//         margin-top: 10px;
//       }
//       input, button {
//         padding: 10px;
//         margin: 6px 4px;
//         border-radius: 8px;
//         border: 1px solid #ddd;
//         font-size: 15px;
//       }
//       button {
//         background: #e67e22;
//         color: white;
//         border: none;
//         cursor: pointer;
//       }
//       button:hover {
//         background: #d35400;
//       }
//       .card {
//         border: 1px solid #eee;
//         border-radius: 10px;
//         padding: 15px;
//         margin: 10px 0;
//         box-shadow: 0 2px 5px rgba(0,0,0,0.05);
//       }
//       .navlinks a {
//         background: white;
//         color: #e67e22;
//         padding: 8px 12px;
//         border-radius: 6px;
//         margin-right: 8px;
//         text-decoration: none;
//         font-weight: 500;
//       }
//       .navlinks a:hover {
//         background: #fdf3e7;
//       }
//       .status {
//         display: inline-block;
//         padding: 4px 8px;
//         border-radius: 6px;
//         font-size: 13px;
//         color: white;
//       }
//       .Placed { background: #f39c12; }
//       .Accepted { background: #3498db; }
//       .Preparing { background: #9b59b6; }
//       .Ready { background: #27ae60; }
//       .OutforDelivery { background: #16a085; }
//       .Delivered { background: #2ecc71; }
//     </style>
//   </head>
//   <body>
//     <header>
//       <div><b>🍔 Snackr</b></div>
//       <div class="navlinks">
//         <a href="/">Home</a>
//         ${req.session.userEmail ? `<a href="/myorders">My Orders</a>` : ""}
//         ${req.session.restaurantId ? `<a href="/restaurant/${req.session.restaurantId}/dashboard">Dashboard</a>` : ""}
//         ${req.session.userEmail || req.session.restaurantId ? `<a href="/logout" style="background:#c0392b;color:white;">Logout</a>` : ""}
//       </div>
//     </header>
//     <main>${content}</main>
//   </body>
//   </html>`;
// }

// // ---------- HOME ----------
// app.get("/", (req, res) => {
//   res.send(layout("Snackr Home", `
//     <h1>Welcome to Snackr</h1>
//     <p>Delicious food delivered fast and fresh 🚀</p>
//     <div style="margin-top:20px">
//       <a href="/user" class="btn">👤 User Login</a>
//       <a href="/restaurant" class="btn">🏪 Restaurant Login</a>
//       <a href="/restaurants" class="btn">🍽 Browse Restaurants</a>
//     </div>
//   `, req));
// });

// // ---------- LOGOUT ----------
// app.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/")));

// // ---------- USER AUTH ----------
// app.get("/user", (req, res) => {
//   res.send(layout("User Login", `
//     <h2>👤 User Login / Register</h2>
//     <form method="POST" action="/register/user">
//       <input name="email" placeholder="Email" required>
//       <input type="password" name="password" placeholder="Password" required>
//       <button>Register</button>
//     </form>
//     <form method="POST" action="/login/user">
//       <input name="email" placeholder="Email" required>
//       <input type="password" name="password" placeholder="Password" required>
//       <button>Login</button>
//     </form>
//   `, req));
// });

// app.post("/register/user", async (req, res) => {
//   const { email, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   await new User({ email, password: hashed }).save();
//   res.send(layout("Registered", `<h2>✅ Registration successful!</h2><a href="/user">Go to Login</a>`, req));
// });

// app.post("/login/user", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.send(layout("Error", "❌ User not found", req));
//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok) return res.send(layout("Error", "❌ Wrong password", req));
//   req.session.userEmail = email;
//   res.redirect("/restaurants");
// });

// // ---------- RESTAURANT AUTH ----------
// app.get("/restaurant", (req, res) => {
//   res.send(layout("Restaurant Login", `
//     <h2>🏪 Restaurant Login / Register</h2>
//     <form method="POST" action="/register/restaurant">
//       <input name="name" placeholder="Restaurant Name" required>
//       <input name="email" placeholder="Email" required>
//       <input type="password" name="password" placeholder="Password" required>
//       <input name="address" placeholder="Address">
//       <input name="type" placeholder="Cuisine Type">
//       <button>Register</button>
//     </form>
//     <form method="POST" action="/login/restaurant">
//       <input name="email" placeholder="Email" required>
//       <input type="password" name="password" placeholder="Password" required>
//       <button>Login</button>
//     </form>
//   `, req));
// });

// app.post("/register/restaurant", async (req, res) => {
//   const { name, email, password, address, type } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   await new Restaurant({ name, email, password: hashed, address, type }).save();
//   res.send(layout("Registered", `<h2>✅ Restaurant registered!</h2><a href="/restaurant">Login</a>`, req));
// });

// app.post("/login/restaurant", async (req, res) => {
//   const { email, password } = req.body;
//   const rest = await Restaurant.findOne({ email });
//   if (!rest) return res.send(layout("Error", "❌ Restaurant not found", req));
//   const ok = await bcrypt.compare(password, rest.password);
//   if (!ok) return res.send(layout("Error", "❌ Wrong password", req));
//   req.session.restaurantId = rest._id.toString();
//   res.redirect(`/restaurant/${rest._id}/dashboard`);
// });

// // ---------- RESTAURANT DASHBOARD ----------
// app.get("/restaurant/:id/dashboard", async (req, res) => {
//   const r = await Restaurant.findById(req.params.id);
//   const menu = await Menu.find({ restaurantId: r._id });
//   const orders = await LiveOrder.find({ restaurantId: r._id }).sort({ createdAt: -1 }).lean();

//   res.send(layout(`${r.name} Dashboard`, `
//     <h2>${esc(r.name)} Dashboard</h2>
//     <h3>📋 Menu</h3>
//     <form method="POST" action="/restaurant/${r._id}/menu/add">
//       <input name="name" placeholder="Item Name" required>
//       <input name="price" placeholder="Price" required>
//       <input name="category" placeholder="Category">
//       <button>Add</button>
//     </form>
//     ${menu.map(m => `
//       <div class="card">
//         <b>${esc(m.name)}</b> — ₹${m.price} (${m.category || "General"})
//         <form method="POST" action="/restaurant/${r._id}/menu/delete/${m._id}" style="display:inline;">
//           <button style="background:#c0392b;">🗑️</button>
//         </form>
//       </div>`).join("")}

//     <h3>📦 Live Orders</h3>
//     ${orders.length ? orders.map(o => `
//       <div class="card">
//         <b>Status:</b> <span class="status ${o.status.replace(/\s/g,"")}">${esc(o.status)}</span><br>
//         <b>User:</b> ${esc(o.userEmail)}<br>
//         <b>Total:</b> ₹${o.total}<br>
//         <ul>${o.items.map(i => `<li>${esc(i.itemName)} × ${i.quantity}</li>`).join("")}</ul>
//         ${o.status==="Placed" ? `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/accept"><button>Accept</button></form>` :
//           o.status==="Accepted" ? `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/prepare"><button>Preparing</button></form>` :
//           o.status==="Preparing" ? `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/ready"><button>Mark Ready</button></form>` :
//           o.status==="Out for Delivery" ? `🚚 Out for Delivery` :
//           o.status==="Delivered" ? `✅ Delivered` : ""}
//       </div>`).join("") : "<p>No active orders yet.</p>"}
//   `, req));
// });

// // ---------- MENU & CART ----------
// app.get("/restaurants", async (req, res) => {
//   const rests = await Restaurant.find().lean();
//   res.send(layout("Restaurants", `
//     <h2>🍽 Restaurants</h2>
//     ${rests.map(r => `
//       <div class="card">
//         <b>${esc(r.name)}</b> — ${esc(r.type || "General")}
//         <br><a href="/menu/${r._id}" style="color:#e67e22;text-decoration:none;">View Menu →</a>
//       </div>`).join("")}
//   `, req));
// });

// // ... (rest of routes same logic, same style)
// app.listen(3001, () => console.log("🚀 Snackr running on http://localhost:3001"));
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");
// const bcrypt = require("bcryptjs");

// // ---------- MONGOOSE MODELS ----------
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });
// const User = mongoose.model("User", userSchema);

// const restaurantSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   address: String,
//   type: String,
// });
// const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// const menuSchema = new mongoose.Schema({
//   restaurantId: String,
//   name: String,
//   price: Number,
//   category: String,
// });
// const Menu = mongoose.model("Menu", menuSchema);

// const deliveryPartnerSchema = new mongoose.Schema({
//   name: String,
//   status: { type: String, default: "Available" },
// });
// const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);

// const liveOrderSchema = new mongoose.Schema(
//   {
//     restaurantId: String,
//     userEmail: String,
//     items: Array,
//     total: Number,
//     status: String,
//     deliveryPartnerId: String,
//   },
//   { timestamps: true }
// );
// const LiveOrder = mongoose.model("LiveOrder", liveOrderSchema);

// // ---------- UTILITY FUNCTION ----------
// async function assignDelivery(order) {
//   const partner = await DeliveryPartner.findOne({ status: "Available" });
//   if (!partner) return null;
//   order.deliveryPartnerId = partner._id;
//   order.status = "Out for Delivery";
//   await order.save();
//   await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "Busy" });
//   return partner;
// }

// // ---------- APP SETUP ----------
// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   session({
//     secret: "snackr-secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// mongoose
//   .connect("mongodb://127.0.0.1:27017/snackr", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ DB Error:", err.message));

// function esc(s) {
//   return s
//     ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]))
//     : "";
// }

// // ---------- HOME ----------
// app.get("/", (req, res) => {
//   res.send(`
//   <html>
//   <head>
//     <title>Snackr</title>
//     <style>
//       body{font-family:Arial;background:#fffaf3;padding:40px;}
//       h1{color:#e67e22;}
//       a{display:inline-block;margin:10px 0;color:#fff;background:#e67e22;padding:10px 16px;border-radius:8px;text-decoration:none;}
//       .box{margin-top:20px;}
//     </style>
//   </head>
//   <body>
//     <h1>🍔 Welcome to Snackr</h1>
//     <div class="box">
//       <a href="/user">👤 User Login</a>
//       <a href="/restaurant">🏪 Restaurant Login</a>
//       <a href="/restaurants">🍽 Browse Restaurants</a>
//       ${req.session.userEmail ? `<a href="/myorders">📦 Your Orders</a>` : ""}
//       ${req.session.userEmail || req.session.restaurantId ? 
//         `<a href="/logout" style="background:#c0392b">🚪 Logout</a>` : ""}
//     </div>
//   </body></html>`);
// });

// app.get("/logout", (req, res) => {
//   req.session.destroy(() => res.redirect("/"));
// });

// // ---------- USER AUTH ----------
// app.get("/user", (req, res) => {
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>👤 User Login / Register</h2>
//     <form method="POST" action="/register/user">
//       <input name="email" placeholder="Email" required><br>
//       <input name="password" type="password" placeholder="Password" required><br>
//       <button type="submit">Register</button>
//     </form>
//     <hr>
//     <form method="POST" action="/login/user">
//       <input name="email" placeholder="Email" required><br>
//       <input name="password" type="password" placeholder="Password" required><br>
//       <button type="submit">Login</button>
//     </form>
//     <a href="/">⬅ Home</a>
//   </body></html>`);
// });

// app.post("/register/user", async (req, res) => {
//   const { email, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   await new User({ email, password: hashed }).save();
//   res.send("✅ Registered! <a href='/user'>Login</a>");
// });

// app.post("/login/user", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.send("❌ User not found");
//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok) return res.send("❌ Wrong password");
//   req.session.userEmail = email;
//   res.redirect("/restaurants");
// });

// // ---------- RESTAURANT AUTH ----------
// app.get("/restaurant", (req, res) => {
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>🏪 Restaurant Login / Register</h2>
//     <form method="POST" action="/register/restaurant">
//       <input name="name" placeholder="Name" required><br>
//       <input name="email" placeholder="Email" required><br>
//       <input type="password" name="password" placeholder="Password" required><br>
//       <input name="address" placeholder="Address"><br>
//       <input name="type" placeholder="Cuisine Type"><br>
//       <button type="submit">Register</button>
//     </form>
//     <hr>
//     <form method="POST" action="/login/restaurant">
//       <input name="email" placeholder="Email" required><br>
//       <input type="password" name="password" placeholder="Password" required><br>
//       <button>Login</button>
//     </form>
//     <a href="/">⬅ Home</a>
//   </body></html>`);
// });

// app.post("/register/restaurant", async (req, res) => {
//   const { name, email, password, address, type } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   await new Restaurant({ name, email, password: hashed, address, type }).save();
//   res.send("✅ Registered! <a href='/restaurant'>Login</a>");
// });

// app.post("/login/restaurant", async (req, res) => {
//   const { email, password } = req.body;
//   const rest = await Restaurant.findOne({ email });
//   if (!rest) return res.send("❌ Restaurant not found");
//   const ok = await bcrypt.compare(password, rest.password);
//   if (!ok) return res.send("❌ Wrong password");
//   req.session.restaurantId = rest._id.toString();
//   res.redirect(`/restaurant/${rest._id}/dashboard`);
// });

// // ---------- RESTAURANT DASHBOARD ----------
// app.get("/restaurant/:id/dashboard", async (req, res) => {
//   const r = await Restaurant.findById(req.params.id);
//   const menu = await Menu.find({ restaurantId: r._id });
//   const orders = await LiveOrder.find({ restaurantId: r._id }).sort({ createdAt: -1 }).lean();

//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>🏪 ${esc(r.name)} Dashboard</h2>
//     <a href="/logout">🚪 Logout</a>
//     <hr>
//     <h3>📋 Menu</h3>
//     <form method="POST" action="/restaurant/${r._id}/menu/add">
//       <input name="name" placeholder="Item" required>
//       <input name="price" placeholder="Price" required>
//       <input name="category" placeholder="Category">
//       <button>Add</button>
//     </form>
//     <ul>${menu.map(m=>`<li>${esc(m.name)} - ₹${m.price} 
//     <form style="display:inline" method="POST" action="/restaurant/${r._id}/menu/delete/${m._id}">
//     <button>🗑️</button></form></li>`).join("")}</ul>

//     <hr><h3>📦 Live Orders</h3>
//     ${orders.length ? orders.map(o=>`
//       <div style="border:1px solid #ddd;padding:10px;margin:10px 0;border-radius:6px">
//         <b>Order:</b> ${o._id}<br>
//         <b>User:</b> ${esc(o.userEmail)}<br>
//         <b>Status:</b> ${esc(o.status)}<br>
//         <ul>${o.items.map(i=>`<li>${esc(i.itemName)} × ${i.quantity}</li>`).join("")}</ul>
//         ${o.status==="Placed"?
//           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/accept"><button>Accept</button></form>`:
//           o.status==="Accepted"?
//           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/prepare"><button>Preparing</button></form>`:
//           o.status==="Preparing"?
//           `<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/ready"><button>Ready</button></form>`:
//           o.status==="Out for Delivery"?"🚚 Out for Delivery":
//           o.status==="Delivered"?"✅ Delivered":""}
//       </div>`).join(""):"<p>No orders</p>"}
//   </body></html>`);
// });

// app.post("/restaurant/:id/menu/add", async (req,res)=>{
//   const {name,price,category}=req.body;
//   await new Menu({restaurantId:req.params.id,name,price,category}).save();
//   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// });

// app.post("/restaurant/:id/menu/delete/:itemId", async(req,res)=>{
//   await Menu.findByIdAndDelete(req.params.itemId);
//   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// });

// app.post("/restaurant/:id/orders/:orderId/:action", async (req,res)=>{
//   const {action}=req.params;
//   const order=await LiveOrder.findById(req.params.orderId);
//   if(!order)return res.send("Order not found");
//   if(action==="accept")order.status="Accepted";
//   if(action==="prepare")order.status="Preparing";
//   if(action==="ready"){order.status="Ready";await assignDelivery(order);}
//   await order.save();
//   res.redirect(`/restaurant/${req.params.id}/dashboard`);
// });

// // ---------- MENU & USER SIDE ----------
// app.get("/restaurants", async (req, res) => {
//   const rests = await Restaurant.find().lean();
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>🍽 Choose Restaurant</h2>
//     ${rests.map(r=>`<div><b>${esc(r.name)}</b> (${esc(r.type||'General')})
//     <a href="/menu/${r._id}">View Menu</a></div>`).join("")}
//     <a href="/">⬅ Home</a>
//   </body></html>`);
// });

// app.get("/menu/:id", async (req,res)=>{
//   const r=await Restaurant.findById(req.params.id);
//   const menu=await Menu.find({restaurantId:r._id});
//   const count=(req.session.cart||[]).reduce((s,i)=>s+i.quantity,0);
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>${esc(r.name)} Menu</h2>
//     <a href="/cart">🛒 Cart (${count})</a><hr>
//     ${menu.map(m=>`
//       <div style="margin:8px 0">
//         <b>${esc(m.name)}</b> ₹${m.price}
//         <form method="POST" action="/cart/add" style="display:inline">
//           <input type="hidden" name="restaurantId" value="${r._id}">
//           <input type="hidden" name="itemId" value="${m._id}">
//           <input type="hidden" name="itemName" value="${esc(m.name)}">
//           <input type="hidden" name="price" value="${m.price}">
//           <input type="number" name="quantity" min="1" value="1" style="width:60px">
//           <button>Add</button>
//         </form>
//       </div>`).join("")}
//     <a href="/restaurants">⬅ Back</a>
//   </body></html>`);
// });

// // ---------- CART ----------
// app.post("/cart/add",(req,res)=>{
//   const {itemId,restaurantId,itemName,price,quantity}=req.body;
//   if(!req.session.cart)req.session.cart=[];
//   const existing=req.session.cart.find(i=>i.itemId===itemId);
//   if(existing)existing.quantity+=parseInt(quantity);
//   else req.session.cart.push({itemId,restaurantId,itemName,price:parseFloat(price),quantity:parseInt(quantity)});
//   res.redirect("/cart");
// });

// app.get("/cart",(req,res)=>{
//   const cart=req.session.cart||[];
//   if(!cart.length)return res.send("<h3>Empty cart</h3><a href='/restaurants'>Back</a>");
//   const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>🛒 Your Cart</h2>
//     ${cart.map(i=>`
//       <div>${esc(i.itemName)} × ${i.quantity} — ₹${i.price*i.quantity}
//         <form method="POST" action="/cart/update" style="display:inline">
//           <input type="hidden" name="itemId" value="${i.itemId}">
//           <button name="action" value="increase">+</button>
//           <button name="action" value="decrease">-</button>
//         </form>
//       </div>`).join("")}
//     <h3>Total: ₹${total}</h3>
//     <form method="POST" action="/order/confirm"><button>Place Order</button></form>
//   </body></html>`);
// });

// app.post("/cart/update",(req,res)=>{
//   const {itemId,action}=req.body;
//   const cart=req.session.cart||[];
//   const i=cart.find(c=>c.itemId===itemId);
//   if(!i)return res.redirect("/cart");
//   if(action==="increase")i.quantity++;
//   if(action==="decrease")i.quantity--;
//   if(i.quantity<=0)req.session.cart=cart.filter(c=>c.itemId!==itemId);
//   res.redirect("/cart");
// });

// // ---------- PLACE ORDER ----------
// app.post("/order/confirm",async(req,res)=>{
//   const cart=req.session.cart||[];
//   if(!cart.length)return res.send("Cart empty");
//   const grouped={};
//   cart.forEach(i=>{
//     if(!grouped[i.restaurantId])grouped[i.restaurantId]=[];
//     grouped[i.restaurantId].push(i);
//   });
//   for(const[rId,items]of Object.entries(grouped)){
//     const total=items.reduce((s,i)=>s+i.price*i.quantity,0);
//     await new LiveOrder({restaurantId:rId,userEmail:req.session.userEmail||"guest",items,total,status:"Placed"}).save();
//   }
//   req.session.cart=[];
//   res.send("<h2>✅ Order Placed!</h2><a href='/myorders'>📦 View Your Orders</a>");
// });

// // ---------- MY ORDERS ----------
// app.get("/myorders",async(req,res)=>{
//   const email=req.session.userEmail;
//   if(!email)return res.redirect("/user");
//   const orders=await LiveOrder.find({userEmail:email}).sort({createdAt:-1}).lean();
//   res.send(`
//   <html><body style="font-family:Arial;padding:40px">
//     <h2>📦 Your Orders</h2>
//     ${orders.length?orders.map(o=>`
//       <div style="border:1px solid #ddd;padding:10px;margin:10px 0;border-radius:8px">
//         <b>Status:</b> ${esc(o.status)}<br>
//         <b>Total:</b> ₹${o.total}<br>
//         <ul>${o.items.map(i=>`<li>${esc(i.itemName)} × ${i.quantity}</li>`).join("")}</ul>
//       </div>`).join(""):"<p>No orders yet.</p>"}
//     <a href="/">⬅ Home</a>
//   </body></html>`);
// });

// app.listen(3001,()=>console.log("🚀 Snackr running on http://localhost:3001"));
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// ---------- SCHEMAS ----------
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
}));

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  type: String,
}));

const Menu = mongoose.model("Menu", new mongoose.Schema({
  restaurantId: String,
  name: String,
  price: Number,
  category: String,
}));

const DeliveryPartner = mongoose.model("DeliveryPartner", new mongoose.Schema({
  name: String,
  status: { type: String, default: "Available" },
}));

const LiveOrder = mongoose.model("LiveOrder", new mongoose.Schema({
  restaurantId: String,
  userEmail: String,
  items: Array,
  total: Number,
  status: String,
  deliveryPartnerId: String,
}, { timestamps: true }));

// ---------- DELIVERY ASSIGNMENT ----------
async function assignDelivery(order) {
  const partner = await DeliveryPartner.findOne({ status: "Available" });
  if (!partner) return null;
  order.deliveryPartnerId = partner._id;
  order.status = "Out for Delivery";
  await order.save();
  await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "Busy" });
  return partner;
}

// ---------- SERVER SETUP ----------
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "snackr", resave: false, saveUninitialized: true }));

mongoose.connect("mongodb://127.0.0.1:27017/snackr")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB error:", err.message));

function esc(s) {
  return s ? String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : "";
}

function layout(title, content, req) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body{font-family:Segoe UI,Arial,sans-serif;margin:0;background:#fafafa;color:#333;}
      header{background:#e67e22;color:white;padding:12px 25px;display:flex;justify-content:space-between;align-items:center;}
      a{color:#e67e22;text-decoration:none;}
      header a{color:white;margin-left:15px;font-weight:500;}
      .btn{background:#e67e22;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;}
      .btn:hover{background:#d35400;}
      main{max-width:900px;margin:40px auto;padding:30px;background:white;border-radius:12px;box-shadow:0 3px 10px rgba(0,0,0,0.1);}
      .card{border:1px solid #eee;border-radius:10px;padding:15px;margin:12px 0;box-shadow:0 2px 5px rgba(0,0,0,0.05);}
      input{padding:8px;margin:6px;border:1px solid #ccc;border-radius:6px;}
      h2{color:#e67e22;}
      .status{display:inline-block;padding:3px 8px;border-radius:5px;font-size:13px;color:white;}
      .Placed{background:#f39c12}.Accepted{background:#3498db}.Preparing{background:#9b59b6}.Ready{background:#27ae60}.Delivered{background:#2ecc71}
    </style>
  </head>
  <body>
    <header>
      <div><b>🍔 Snackr</b></div>
      <div>
        <a href="/">Home</a>
        ${req.session.userEmail ? `<a href="/myorders">My Orders</a>` : ""}
        ${req.session.restaurantId ? `<a href="/restaurant/${req.session.restaurantId}/dashboard">Dashboard</a>` : ""}
        ${req.session.userEmail || req.session.restaurantId ? `<a href="/logout">Logout</a>` : ""}
      </div>
    </header>
    <main>${content}</main>
  </body></html>`;
}

// ---------- HOME ----------
app.get("/", async (req, res) => {
  const restaurants = await Restaurant.find().lean();
  res.send(layout("Snackr Home", `
    <h1>Welcome to Snackr</h1>
    <p>Delicious food from top restaurants near you 🚀</p>
    <div style="margin:20px 0;">
      <a href="/user" class="btn">👤 User Login</a>
      <a href="/restaurant" class="btn">🏪 Restaurant Login</a>
    </div>
    <h2>🍽 Restaurants</h2>
    ${restaurants.length ? restaurants.map(r => `
      <div class="card">
        <b>${esc(r.name)}</b> (${esc(r.type || "General")})<br>
        <small>${esc(r.address || "No address given")}</small><br>
        <a href="/menu/${r._id}">View Menu →</a>
      </div>
    `).join("") : "<p>No restaurants yet.</p>"}
  `, req));
});

app.get("/logout", (req, res) => req.session.destroy(() => res.redirect("/")));

// ---------- USER LOGIN ----------
app.get("/user", (req, res) => {
  res.send(layout("User Login", `
    <h2>👤 User Login / Register</h2>
    <form method="POST" action="/register/user">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button class="btn">Register</button>
    </form>
    <form method="POST" action="/login/user">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button class="btn">Login</button>
    </form>
  `, req));
});

app.post("/register/user", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await new User({ email: req.body.email, password: hashed }).save();
  res.redirect("/user");
});

app.post("/login/user", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.send("Wrong password");
  req.session.userEmail = user.email;
  res.redirect("/");
});

// ---------- RESTAURANT LOGIN ----------
app.get("/restaurant", (req, res) => {
  res.send(layout("Restaurant Login", `
    <h2>🏪 Restaurant Login / Register</h2>
    <form method="POST" action="/register/restaurant">
      <input name="name" placeholder="Name" required><br>
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input name="address" placeholder="Address"><br>
      <input name="type" placeholder="Cuisine Type"><br>
      <button class="btn">Register</button>
    </form>
    <form method="POST" action="/login/restaurant">
      <input name="email" placeholder="Email" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button class="btn">Login</button>
    </form>
  `, req));
});

app.post("/register/restaurant", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await new Restaurant({ ...req.body, password: hashed }).save();
  res.redirect("/restaurant");
});

app.post("/login/restaurant", async (req, res) => {
  const rest = await Restaurant.findOne({ email: req.body.email });
  if (!rest) return res.send("Restaurant not found");
  const ok = await bcrypt.compare(req.body.password, rest.password);
  if (!ok) return res.send("Wrong password");
  req.session.restaurantId = rest._id.toString();
  res.redirect(`/restaurant/${rest._id}/dashboard`);
});

// ---------- RESTAURANT DASHBOARD ----------
app.get("/restaurant/:id/dashboard", async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  const menu = await Menu.find({ restaurantId: r._id });
  const orders = await LiveOrder.find({ restaurantId: r._id }).sort({ createdAt: -1 });

  res.send(layout(`${r.name} Dashboard`, `
    <h2>${esc(r.name)} Dashboard</h2>
    <h3>📋 Menu</h3>
    <form method="POST" action="/restaurant/${r._id}/menu/add">
      <input name="name" placeholder="Item" required>
      <input name="price" placeholder="Price" required>
      <input name="category" placeholder="Category">
      <button class="btn">Add</button>
    </form>
    ${menu.map(m => `<div class="card"><b>${m.name}</b> ₹${m.price}
      <form method="POST" action="/restaurant/${r._id}/menu/delete/${m._id}" style="display:inline">
        <button class="btn" style="background:#c0392b">🗑️</button>
      </form></div>`).join("")}
    <h3>📦 Orders</h3>
    ${orders.length ? orders.map(o => `
      <div class="card">
        <b>User:</b> ${o.userEmail}<br>
        <b>Total:</b> ₹${o.total}<br>
        <b>Status:</b> <span class="status ${o.status}">${o.status}</span><br>
        <ul>${o.items.map(i => `<li>${i.itemName} × ${i.quantity}</li>`).join("")}</ul>
        ${o.status==="Placed"?`<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/accept"><button class="btn">Accept</button></form>`:
        o.status==="Accepted"?`<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/prepare"><button class="btn">Preparing</button></form>`:
        o.status==="Preparing"?`<form method="POST" action="/restaurant/${r._id}/orders/${o._id}/ready"><button class="btn">Mark Ready</button></form>`:""}
      </div>`).join("") : "<p>No orders yet.</p>"}
  `, req));
});

app.post("/restaurant/:id/menu/add", async (req, res) => {
  await new Menu({ restaurantId: req.params.id, ...req.body }).save();
  res.redirect(`/restaurant/${req.params.id}/dashboard`);
});

app.post("/restaurant/:id/menu/delete/:itemId", async (req, res) => {
  await Menu.findByIdAndDelete(req.params.itemId);
  res.redirect(`/restaurant/${req.params.id}/dashboard`);
});

app.post("/restaurant/:id/orders/:orderId/:action", async (req, res) => {
  const order = await LiveOrder.findById(req.params.orderId);
  if (!order) return res.send("Order not found");
  if (req.params.action === "accept") order.status = "Accepted";
  if (req.params.action === "prepare") order.status = "Preparing";
  if (req.params.action === "ready") {
    order.status = "Ready";
    await assignDelivery(order);
  }
  await order.save();
  res.redirect(`/restaurant/${req.params.id}/dashboard`);
});

// ---------- MENU PAGE ----------
app.get("/menu/:id", async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  const menu = await Menu.find({ restaurantId: r._id });
  const count = (req.session.cart || []).reduce((s, i) => s + i.quantity, 0);
  res.send(layout(`${r.name} Menu`, `
    <h2>${esc(r.name)} Menu</h2>
    <a href="/cart" class="btn">🛒 Cart (${count})</a><hr>
    ${menu.length ? menu.map(m => `
      <div class="card">
        <b>${esc(m.name)}</b> — ₹${m.price} <small>${m.category || ""}</small>
        <form method="POST" action="/cart/add" style="display:inline">
          <input type="hidden" name="restaurantId" value="${r._id}">
          <input type="hidden" name="itemId" value="${m._id}">
          <input type="hidden" name="itemName" value="${m.name}">
          <input type="hidden" name="price" value="${m.price}">
          <input type="number" name="quantity" min="1" value="1" style="width:60px">
          <button class="btn">Add</button>
        </form>
      </div>
    `).join("") : "<p>No menu items yet.</p>"}
  `, req));
});

// ---------- CART ----------
app.post("/cart/add", (req, res) => {
  const { itemId, restaurantId, itemName, price, quantity } = req.body;
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find(i => i.itemId === itemId);
  if (existing) existing.quantity += parseInt(quantity);
  else req.session.cart.push({ itemId, restaurantId, itemName, price: parseFloat(price), quantity: parseInt(quantity) });
  res.redirect("/cart");
});

app.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  res.send(layout("Your Cart", `
    <h2>🛒 Your Cart</h2>
    ${cart.length ? cart.map(i => `
      <div>${esc(i.itemName)} × ${i.quantity} — ₹${i.price * i.quantity}
        <form method="POST" action="/cart/update" style="display:inline">
          <input type="hidden" name="itemId" value="${i.itemId}">
          <button name="action" value="increase">+</button>
          <button name="action" value="decrease">-</button>
        </form>
      </div>`).join("") : "<p>Cart is empty.</p>"}
    <h3>Total: ₹${total}</h3>
    <form method="POST" action="/order/confirm"><button class="btn">Place Order</button></form>
  `, req));
});

app.post("/cart/update", (req, res) => {
  const { itemId, action } = req.body;
  const cart = req.session.cart || [];
  const i = cart.find(c => c.itemId === itemId);
  if (!i) return res.redirect("/cart");
  if (action === "increase") i.quantity++;
  if (action === "decrease") i.quantity--;
  if (i.quantity <= 0) req.session.cart = cart.filter(c => c.itemId !== itemId);
  res.redirect("/cart");
});

// ---------- ORDER ----------
app.post("/order/confirm", async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.send("Cart empty");
  const grouped = {};
  cart.forEach(i => {
    if (!grouped[i.restaurantId]) grouped[i.restaurantId] = [];
    grouped[i.restaurantId].push(i);
  });
  for (const [rId, items] of Object.entries(grouped)) {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    await new LiveOrder({ restaurantId: rId, userEmail: req.session.userEmail || "guest", items, total, status: "Placed" }).save();
  }
  req.session.cart = [];
  res.send(layout("Order Placed", `<h2>✅ Order placed successfully!</h2><a href="/myorders" class="btn">View My Orders</a>`, req));
});

// ---------- MY ORDERS ----------
app.get("/myorders", async (req, res) => {
  if (!req.session.userEmail) return res.redirect("/user");
  const orders = await LiveOrder.find({ userEmail: req.session.userEmail }).sort({ createdAt: -1 });
  res.send(layout("My Orders", `
    <h2>📦 My Orders</h2>
    ${orders.length ? orders.map(o => `
      <div class="card">
        <b>Total:</b> ₹${o.total}<br>
        <b>Status:</b> <span class="status ${o.status}">${o.status}</span>
        <ul>${o.items.map(i => `<li>${i.itemName} × ${i.quantity}</li>`).join("")}</ul>
      </div>
    `).join("") : "<p>No orders yet.</p>"}
  `, req));
});

app.listen(3001, () => console.log("🚀 Snackr running at http://localhost:3001"));
