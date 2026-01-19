// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");
// const bcrypt = require("bcryptjs");

// const User = require("./models/User");
// const Restaurant = require("./models/Restaurant");
// const Menu = require("./models/Menu");
// const DeliveryPartner = require("./models/DeliveryPartner");
// const LiveOrder = require("./models/LiveOrder");
// const FoodShelter = require("./models/FoodShelter");
// const Donation = require("./models/Donation");
// const Booking = require("./models/Booking");

// // fallback delivery assignment
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
// app.use(express.static(path.join(__dirname, "..", "public")));

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
//   return s ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : "";
// }
// // ---------- AUTH: USER ----------


// app.get("/user", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>User Access</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f4f7f6;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           margin: 0;
//         }
//         .auth-container {
//           background: #ffffff;
//           padding: 40px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//           width: 100%;
//           max-width: 380px;
//         }
//         h2 {
//           color: #333;
//           text-align: center;
//           margin-bottom: 30px;
//         }
//         h3 {
//           color: #555;
//           margin-top: 0;
//           margin-bottom: 20px;
//           text-align: center;
//           font-weight: 500;
//         }
//         form {
//           margin-bottom: 25px;
//           padding: 20px 0;
//           border-top: 1px solid #eee;
//         }
//         form:first-of-type {
//             border-top: none;
//         }
//         label {
//             display: block;
//             margin-bottom: 5px;
//             font-weight: 600;
//             color: #555;
//             font-size: 0.95em;
//         }
//         input[type="text"], input[type="email"], input[type="password"], input[type="number"] {
//           width: 100%;
//           padding: 12px;
//           margin-bottom: 15px;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           box-sizing: border-box; /* Important for padding to not affect width */
//           font-size: 1em;
//         }
//         button {
//           width: 100%;
//           padding: 12px;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 1.05em;
//           font-weight: bold;
//           transition: background-color 0.2s;
//         }
//         button:hover {
//           background-color: #0056b3;
//         }
//         .switch-link {
//           display: block;
//           text-align: center;
//           margin-top: 20px;
//           font-size: 0.9em;
//           color: #007bff;
//         }
//         .switch-link a {
//             color: #007bff;
//             text-decoration: none;
//             font-weight: 600;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="auth-container">
//         <h2>👋 Welcome Back!</h2>

//         <form method="POST" action="/login/user">
//           <label for="login-email">Email Address</label>
//           <input id="login-email" name="email" type="email" placeholder="you@example.com" required>
          
//           <label for="login-password">Password</label>
//           <input id="login-password" name="password" type="password" placeholder="••••••••" required>
          
//           <button type="submit">🔑 Log In</button>
//         </form>

//         <hr style="border: 0; border-top: 1px solid #eee;">
        
//         <form method="POST" action="/register/user">
//           <h3>New User? Register Now</h3>
          
//           <label for="register-name">Full Name</label>
//           <input id="register-name" name="name" type="text" placeholder="John Doe" required>
          
//           <label for="register-email">Email Address</label>
//           <input id="register-email" name="email" type="email" placeholder="you@example.com" required>
          
//           <label for="register-password">Create Password</label>
//           <input id="register-password" name="password" type="password" placeholder="At least 6 characters" required>

//           <!-- Address Fields -->
//           <label for="register-flat">Flat No.</label>
//           <input id="register-flat" name="flat" type="text" placeholder="Flat No." required>

//           <label for="register-building">Building Name</label>
//           <input id="register-building" name="building" type="text" placeholder="Building Name" required>

//           <label for="register-region">Region</label>
//           <input id="register-region" name="region" type="text" placeholder="Region" required>

//           <label for="register-landmark">Landmark</label>
//           <input id="register-landmark" name="landmark" type="text" placeholder="Landmark" required>

//           <label for="register-city">City</label>
//           <input id="register-city" name="city" type="text" placeholder="City" required>

//           <label for="register-pin">Pin Code</label>
//           <input id="register-pin" name="pin" type="number" placeholder="Pin Code" required>

//           <button type="submit" style="background-color: #28a745;">🚀 Register</button>
//         </form>

//         <div class="switch-link">
//             <a href="/">🏠 Go to Home Page</a>
//         </div>
//       </div>
//     </body>
//     </html>
//   `);
// });
// app.get("/bookings", async (req, res) => {
//   const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
//   res.send(`
//     <h1>All Bookings</h1>
//     <ul>
//       ${bookings.map(b => `
//         <li>
//           ${b.name} - ${b.date} ${b.time} (${b.guests} guests)
//           - <b>${b.status}</b>
//         </li>`).join("")}
//     </ul>
//     <a href="/restaurants">Back</a>
//   `);
// });
// // --------------------------------------------------
// // 🪑 TABLE BOOKING ROUTE
// // --------------------------------------------------
// app.post("/book-table", async (req, res) => {
//   try {
//     const { name, email, phone, date, time, guests, specialRequest } = req.body;

//     // Optional: track logged-in user
//     const userId = req.session?.userId || null;

//     const newBooking = new Booking({
//       userId,
//       name,
//       email,
//       phone,
//       date,
//       time,
//       guests,
//       specialRequest,
//     });

//     await newBooking.save();

//     res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <title>Booking Confirmed</title>
//         <script src="https://cdn.tailwindcss.com"></script>
//       </head>
//       <body class="bg-gray-50 flex items-center justify-center min-h-screen">
//         <div class="bg-white p-10 rounded-xl shadow-lg text-center">
//           <h1 class="text-3xl font-bold text-green-600 mb-4">✅ Table Booked Successfully!</h1>
//           <p class="text-gray-700 mb-2"><strong>${guests}</strong> guests on <strong>${date}</strong> at <strong>${time}</strong>.</p>
//           <p class="text-gray-600 mb-6">We’ll confirm shortly via <strong>${email}</strong>.</p>
//           <a href="/restaurants" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">← Back to Restaurants</a>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (err) {
//     console.error("Booking error:", err);
//     res.status(500).send("Error while booking table. Please try again.");
//   }
// });
// app.get("/bookings", async (req, res) => {
//   const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
//   res.send(`
//     <h1>All Table Bookings</h1>
//     <ul>
//       ${bookings.map(b => `
//         <li>
//           ${b.name} - ${b.date} ${b.time} (${b.guests} guests)
//         </li>`).join("")}
//     </ul>
//   `);
// });

// app.post("/register/user", async (req, res) => {
//   const { name, email, password, flat, building, region, landmark, city, pin } = req.body;

//   // **UX Improvement:** Check if user already exists before hashing
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.send("⚠️ Email already registered. <a href='/user'>Login instead</a>");
//   }

//   // Hash the password
//   const hashed = await bcrypt.hash(password, 10);

//   // Create a new user with address information
//   const newUser = new User({
//     name,
//     email,
//     password: hashed,
//     address: {
//       flat,
//       building,
//       region,
//       landmark,
//       city,
//       pin
//     }
//   });

//   // Save the user to the database
//   await newUser.save();

//   // **UX Improvement:** Redirect to the login page with a success flag
//   res.redirect("/user?status=registered");
// });

// app.post("/login/user", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Look up the user by email
//     const user = await User.findOne({ email });
    
//     // If no user is found, return a generic error message
//     if (!user) {
//       return res.status(401).json({ message: "Login failed. Please check your email and password." });
//     }

//     // Compare password hashes
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(401).json({ message: "Login failed. Please check your email and password." });
//     }

//     // Save user ID in the session (for security purposes)
//     req.session.userId = user._id;

//     // Redirect the user to the restaurants page
//     res.redirect("/restaurants");

//   } catch (error) {
//     // Log and return a generic error if something goes wrong
//     console.error(error);
//     res.status(500).json({ message: "An error occurred during login. Please try again." });
//   }
// });


// // ---------- AUTH: RESTAURANT ----------


// app.get("/restaurant", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Restaurant Access</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f4f7f6;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           margin: 0;
//         }
//         .auth-container {
//           background: #ffffff;
//           padding: 40px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//           width: 100%;
//           max-width: 480px; 
//         }
//         h2 {
//           color: #333;
//           text-align: center;
//           margin-bottom: 30px;
//         }
//         h3 {
//             color: #555;
//             margin-top: 0;
//             margin-bottom: 20px;
//             text-align: center;
//             font-weight: 500;
//         }
//         form {
//           margin-bottom: 25px;
//           padding: 20px 0;
//           border-top: 1px solid #eee;
//         }
//         form:first-of-type {
//             border-top: none;
//         }
//         label {
//             display: block;
//             margin-bottom: 5px;
//             font-weight: 600;
//             color: #555;
//             font-size: 0.95em;
//         }
//         input[type="text"], input[type="email"], input[type="password"], input[type="number"] {
//           width: 100%;
//           padding: 12px;
//           margin-bottom: 15px;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           box-sizing: border-box; 
//           font-size: 1em;
//         }
//         .input-row {
//             display: flex;
//             gap: 15px;
//             margin-bottom: 15px;
//         }
//         .input-row > div {
//             flex: 1;
//         }
//         button {
//           width: 100%;
//           padding: 12px;
//           background-color: #0044ffff;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 1.05em;
//           font-weight: bold;
//           transition: background-color 0.2s;
//         }
//         button.login-btn:hover {
//           background-color: #2f09eeff;
//         }
//         button.register-btn {
//             background-color: #28a745;
//         }
//         button.register-btn:hover {
//             background-color: #1e7e34;
//         }
//         .switch-link {
//           display: block;
//           text-align: center;
//           margin-top: 20px;
//           font-size: 0.9em;
//         }
//         .switch-link a {
//             color: #007bff;
//             text-decoration: none;
//             font-weight: 600;
//         }
//         /* Custom styles for the Radio Group */
//         .radio-group {
//             margin-bottom: 20px;
//             padding: 10px;
//             border: 1px solid #ff6f0020;
//             border-radius: 6px;
//             background-color: #fffaf5;
//         }
//         .radio-group input {
//             margin-right: 8px;
//         }
//         .radio-group label {
//             display: inline-block;
//             margin-right: 20px;
//             font-weight: normal;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="auth-container">
//         <h2>🏪 Restaurant Partner Portal</h2>

//         <form method="POST" action="/login/restaurant">
//           <h3>Log In to Your Dashboard</h3>
          
//           <label for="login-email">Email Address</label>
//           <input id="login-email" name="email" type="email" placeholder="restaurant@example.com" required>
          
//           <label for="login-password">Password</label>
//           <input id="login-password" name="password" type="password" placeholder="••••••••" required>
          
//           <button type="submit" class="login-btn">🔑 Partner Log In</button>
//         </form>

//         <hr style="border: 0; border-top: 1px solid #eee;">
        
//         <form method="POST" action="/register/restaurant">
//           <h3>Register Your Restaurant</h3>
          
//           <label for="reg-name">Restaurant Name</label>
//           <input id="reg-name" name="name" type="text" placeholder="The Delicious Diner" required>
          
//           <div class="radio-group">
//             <label style="display: block; margin-bottom: 10px; color: #001affff;">Select Restaurant Type:</label>
//             <input type="radio" id="type-normal" name="type" value="Normal" required checked>
//             <label for="type-normal">🏢 **Normal Restaurant** (Commercial Space)</label>
            
//             <input type="radio" id="type-home" name="type" value="Home" required>
//             <label for="type-home">🏡 **Home Kitchen** (Home-Based Business)</label>
//           </div>
          
//           <div class="input-row">
//             <div>
//                 <label for="reg-size">Table Size (No. of Tables)</label>
//                 <input id="reg-size" name="size" type="number" placeholder="e.g., 15" min="0" required>
//             </div>
//             <div>
//                 <label for="reg-capacity">Max Capacity (Total Seats)</label>
//                 <input id="reg-capacity" name="capacity" type="number" placeholder="e.g., 60" min="1" required>
//             </div>
//           </div>

//           <label for="reg-email">Business Email</label>
//           <input id="reg-email" name="email" type="email" placeholder="manager@diner.com" required>
          
//           <label for="reg-password">Create Password</label>
//           <input id="reg-password" name="password" type="password" placeholder="Secure Password" required>
          
//           <label for="reg-address">Full Address</label>
//           <input id="reg-address" name="address" type="text" placeholder="123 Main St, City, Zip" required>
          
//           <label for="reg-cuisine">Cuisine Type</label>
//           <input id="reg-cuisine" name="cuisine" type="text" placeholder="e.g., Italian, Vegan, Fusion" required>
          
//           <button type="submit" class="register-btn">➕ Register & Start Selling</button>
//         </form>

//         <div class="switch-link">
//             <a href="/">🏠 Go to Home Page</a>
//         </div>
//       </div>
//     </body>
//     </html>
//   `);
// });


// app.post("/register/restaurant", async (req, res) => {
//   // Destructure all new and existing fields
//   const { name, email, password, address, type, cuisine, size, capacity } = req.body;
  
//   // Basic validation (optional, but highly recommended in production)
//   if (!name || !email || !password || !address || !type || !cuisine || !size || !capacity) {
//       return res.send("❌ All fields are required for registration.");
//   }
  
//   // Hash the password
//   const hashed = await bcrypt.hash(password, 10);
  
//   // Save all collected data
//   await new Restaurant({ 
//     name, 
//     email, 
//     password: hashed, 
//     address, 
//     type, // 'Home' or 'Normal'
//     cuisine, // The type of food (e.g., 'Italian')
//     size: parseInt(size, 10), // Convert to number
//     capacity: parseInt(capacity, 10) // Convert to number
//   }).save();
  
//   // UX Improvement: Redirect to the login page
//   res.send("✅ Restaurant registered! <a href='/restaurant'>Login</a>");
// });

// app.post("/login/restaurant", async (req, res) => {
//   const { email, password } = req.body;
//   const rest = await Restaurant.findOne({ email });
  
//   // Combined check for better security and clean error message
//   if (!rest || !(await bcrypt.compare(password, rest.password))) {
//     return res.send("❌ Login failed. Please check your email and password.");
//   }
  
//   req.session.restaurantId = rest._id.toString();
//   res.redirect(`/restaurant/${rest._id}/orders`);
// });


// // ---------- AUTH: DELIVERY ----------

// app.get("/delivery", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Delivery Partner Access</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f4f7f6;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           margin: 0;
//         }
//         .auth-container {
//           background: #ffffff;
//           padding: 40px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//           width: 100%;
//           max-width: 400px; 
//         }
//         h2 {
//           color: #333;
//           text-align: center;
//           margin-bottom: 30px;
//         }
//         h3 {
//             color: #555;
//             margin-top: 0;
//             margin-bottom: 20px;
//             text-align: center;
//             font-weight: 500;
//         }
//         form {
//           margin-bottom: 25px;
//           padding: 20px 0;
//           border-top: 1px solid #eee;
//         }
//         form:first-of-type {
//             border-top: none;
//         }
//         label {
//             display: block;
//             margin-bottom: 5px;
//             font-weight: 600;
//             color: #555;
//             font-size: 0.95em;
//         }
//         input[type="text"], input[type="email"], input[type="password"] {
//           width: 100%;
//           padding: 12px;
//           margin-bottom: 15px;
//           border: 1px solid #ccc;
//           border-radius: 6px;
//           box-sizing: border-box; 
//           font-size: 1em;
//         }
//         button {
//           width: 100%;
//           padding: 12px;
//           background-color: #17a2b8; /* A cool cyan for delivery/logistics */
//           color: white;
//           border: none;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 1.05em;
//           font-weight: bold;
//           transition: background-color 0.2s;
//         }
//         button.login-btn:hover {
//           background-color: #117a8b;
//         }
//         button.register-btn {
//             background-color: #6f42c1; /* Purple for registration action */
//         }
//         button.register-btn:hover {
//             background-color: #5a359b;
//         }
//         .switch-link {
//           display: block;
//           text-align: center;
//           margin-top: 20px;
//           font-size: 0.9em;
//         }
//         .switch-link a {
//             color: #007bff;
//             text-decoration: none;
//             font-weight: 600;
//         }
//         /* Custom styles for the Radio Group */
//         .radio-group {
//             margin-bottom: 20px;
//             padding: 10px;
//             border: 1px solid #17a2b820;
//             border-radius: 6px;
//             background-color: #f7feff;
//         }
//         .radio-group input {
//             margin-right: 8px;
//         }
//         .radio-group label {
//             display: inline-block;
//             margin-right: 15px;
//             font-weight: normal;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="auth-container">
//         <h2>🚀 Delivery Partner Portal</h2>

//         <!-- Login Form -->
//         <form method="POST" action="/login/delivery">
//           <h3>Log In</h3>
          
//           <label for="login-email">Email Address</label>
//           <input id="login-email" name="email" type="email" placeholder="driver@example.com" required>
          
//           <label for="login-password">Password</label>
//           <input id="login-password" name="password" type="password" placeholder="••••••••" required>
          
//           <button type="submit" class="login-btn">🔑 Log In</button>
//         </form>

//         <hr style="border: 0; border-top: 1px solid #eee;">
        
//         <!-- Registration Form with Vehicle Type -->
//         <form method="POST" action="/register/delivery">
//           <h3>Join Our Fleet</h3>
          
//           <label for="reg-name">Your Full Name</label>
//           <input id="reg-name" name="name" type="text" placeholder="John Doe" required>
          
//           <label for="reg-email">Email Address</label>
//           <input id="reg-email" name="email" type="email" placeholder="your@email.com" required>
          
//           <label for="reg-password">Create Password</label>
//           <input id="reg-password" name="password" type="password" placeholder="Secure Password" required>
          
//           <label for="reg-vehicleNo">Vehicle License Plate Number</label>
//           <input id="reg-vehicleNo" name="vehicleNo" type="text" placeholder="e.g., ABC 123" required>

//           <div class="radio-group">
//             <label style="display: block; margin-bottom: 10px; color: #6f42c1;">Select Vehicle Type:</label>
//             <input type="radio" id="type-bike" name="vehicleType" value="Bike" required checked>
//             <label for="type-bike">Normal delivery partner</label>
            
//             <input type="radio" id="type-car" name="vehicleType" value="Car" required>
//             <label for="type-car">Side by side delivery partner</label>
//           </div>
          
//           <button type="submit" class="register-btn">➕ Register as Partner</button>
//         </form>

//         <div class="switch-link">
//             <a href="/">🏠 Go to Home Page</a>
//         </div>
//       </div>
//     </body>
//     </html>
//   `);
// });



// app.post("/register/delivery", async (req, res) => {
//   // Capture the new vehicleType field
//   const { name, email, password, vehicleNo, vehicleType } = req.body; 
  
//   const hashed = await bcrypt.hash(password, 10);
  
//   await new DeliveryPartner({ 
//     name, 
//     email, 
//     password: hashed, 
//     vehicleNo, 
//     vehicleType, // Save the selected type (Bike or Car)
//     status: "Available" // Status is good to keep
//   }).save();
  
//   res.send("✅ Delivery Partner registered! <a href='/delivery'>Login</a>");
// });

// app.post("/login/delivery", async (req, res) => {
//   const { email, password } = req.body;
//   const dp = await DeliveryPartner.findOne({ email });
//   // Improved error messaging for better UX/security
//   if (!dp || !(await bcrypt.compare(password, dp.password))) {
//     return res.send("❌ Login failed. Please check your email and password.");
//   }
  
//   req.session.deliveryId = dp._id.toString();
//   res.redirect(`/delivery/${dp._id}/orders`);
// });


// //=======Food Shelter======

// // ====================================================================
// //                          HELPER FUNCTION
// // ====================================================================

// const getShelterStatusClass = (status) => {
//     switch (status) {
//         case "Accepting Donations":
//             return "bg-green-100 text-green-800";
//         case "Full Capacity":
//             return "bg-yellow-100 text-yellow-800";
//         case "Closed":
//             return "bg-red-100 text-red-800";
//         default:
//             return "bg-gray-100 text-gray-800";
//     }
// };

// // ====================================================================
// //                          /SHELTERS ROUTE (LISTING)
// // ====================================================================

// app.get("/shelters", async (req, res) => {
//     try {
//         const shelters = await FoodShelter.find({ status: "Accepting Donations" }).lean();

//         res.send(`
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <title>Food Shelters & Donations</title>
//                 <script src="https://cdn.tailwindcss.com"></script>
//                 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
//                 <style>
//                     body { font-family: 'Inter', sans-serif; background-color: #f7f7f7; }
//                     .container { max-width: 900px; margin: 40px auto; padding: 32px; background-color: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
//                     .shelter-card { transition: transform 0.2s, box-shadow 0.2s; }
//                     .shelter-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
//                     .status-tag { padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="flex justify-between items-center mb-6 border-b pb-4">
//                         <h1 class="text-4xl font-extrabold text-green-700">💚 Food Donation Shelters</h1>
//                         <a href="/restaurants" class="text-blue-500 hover:text-blue-700 font-medium transition duration-150">
//                             ← Back to Restaurants
//                         </a>
//                     </div>
//                     <p class="text-gray-600 mb-8">
//                         Help reduce food waste! Below are the registered food shelters currently accepting donations.
//                     </p>
//                     <div class="space-y-6">
//                         ${
//                             shelters.length
//                                 ? shelters.map(s => `
//                                     <div class="shelter-card p-6 border-2 border-green-100 rounded-xl bg-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
//                                         <div class="mb-4 md:mb-0 flex-grow">
//                                             <div class="flex items-center space-x-3 mb-2">
//                                                 <h2 class="text-2xl font-bold text-gray-800">${s.name}</h2>
//                                                 <span class="status-tag ${getShelterStatusClass(s.status)}">${s.status}</span>
//                                             </div>
//                                             <p class="text-gray-600"><span class="font-semibold">Location:</span> ${s.address}, ${s.city}</p>
//                                             <p class="text-sm text-gray-500 mt-1">Contact: ${s.contactPerson} (${s.contactPhone})</p>
//                                         </div>
//                                         <a href="/donate/${s._id}" class="w-full md:w-auto">
//                                             <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-105">
//                                                 Donate Food
//                                             </button>
//                                         </a>
//                                     </div>
//                                 `).join("")
//                                 : `
//                                     <div class="p-10 text-center bg-yellow-50 rounded-lg border border-yellow-200">
//                                         <p class="text-xl font-semibold text-yellow-800">No Shelters Currently Accepting Donations 😔</p>
//                                         <p class="text-yellow-600 mt-2">Please check back later or register a new shelter.</p>
//                                     </div>
//                                 `
//                         }
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `);
//     } catch (error) {
//         console.error("Error listing shelters:", error);
//         res.status(500).send("Failed to load shelters list.");
//     }
// });

// // ====================================================================
// //                          /DONATE/:SHELTERID ROUTE (FORM)
// // ====================================================================

// app.get("/donate/:shelterId", async (req, res) => {
//     const shelterId = req.params.shelterId;

//     if (!req.session.userId) {
//         return res.send(`Please <a href="/user/login">log in</a> to make a donation.`);
//     }

//     try {
//         const shelter = await FoodShelter.findById(shelterId).lean();
//         if (!shelter) return res.status(404).send("Shelter not found.");
//         if (shelter.status !== "Accepting Donations") {
//             return res.send(`
//                 <div style="padding:20px;font-family:sans-serif;text-align:center;">
//                     <h2 style="color:red;">❌ Shelter Not Accepting Donations</h2>
//                     <p>${shelter.name} is currently <strong>${shelter.status}</strong>.</p>
//                     <p><a href="/shelters">← Back to Shelters</a></p>
//                 </div>
//             `);
//         }

//         res.send(`
//             <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:8px;">
//                 <h1 style="color:#10b981;">Donating to ${shelter.name}</h1>
//                 <p><strong>Address:</strong> ${shelter.address}, ${shelter.city}</p>
//                 <p><strong>Contact:</strong> ${shelter.contactPerson} (${shelter.contactPhone})</p>
//                 <form action="/donate/submit" method="POST" style="margin-top:20px;">
//                     <input type="hidden" name="shelterId" value="${shelterId}">
//                     <label>Item Description:</label>
//                     <input type="text" name="description" required style="width:100%;padding:10px;margin-bottom:10px;">
//                     <label>Quantity:</label>
//                     <input type="number" name="quantity" min="1" required style="width:100%;padding:10px;margin-bottom:20px;">
//                     <button type="submit" style="background-color:#10b981;color:white;padding:10px 15px;border:none;border-radius:4px;cursor:pointer;">Submit Donation Request</button>
//                 </form>
//                 <p style="margin-top:20px;"><a href="/shelters">← Back to Shelters</a></p>
//             </div>
//         `);
//     } catch (error) {
//         console.error("Error fetching shelter:", error);
//         res.status(500).send("An error occurred.");
//     }
// });

// // ====================================================================
// //                          /DONATE/SUBMIT ROUTE (UPDATED LOGIC)
// // ====================================================================

// app.post("/donate/submit", async (req, res) => {
//     const { shelterId, description, quantity } = req.body;
//     const userId = req.session.userId;

//     if (!userId) {
//         return res.status(401).send("You must be logged in to submit a donation. <a href='/user/login'>Login</a>");
//     }

//     try {
//         const user = await User.findById(userId).lean();
//         if (!user) return res.status(404).send("User not found.");

//         const shelter = await FoodShelter.findById(shelterId).lean();
//         if (!shelter) return res.status(404).send("Shelter not found.");
//         if (shelter.status !== "Accepting Donations") {
//             return res.send(`<h2>${shelter.name} is not accepting donations currently.</h2>`);
//         }

//         const newDonation = new Donation({
//             shelterId,
//             sourceType: "User",
//             sourceId: userId,
//             sourceName: user.name || user.email,
//             items: [{ description, quantity: parseInt(quantity, 10) }],
//             pickupAddress: user.address || "Pickup address not specified",
//             destinationAddress: `${shelter.address}, ${shelter.city}`,
//             status: "Pending Pickup",
//         });

//         await newDonation.save();

//         res.send(`
//             <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:30px;background:#f9fafb;border-radius:10px;">
//                 <h2 style="color:#10b981;">✅ Donation Submitted!</h2>
//                 <p>Thank you, <strong>${user.name || user.email}</strong>! Your donation is <strong>pending pickup</strong>.</p>
//                 <ul>
//                     <li><strong>Item:</strong> ${description}</li>
//                     <li><strong>Quantity:</strong> ${quantity}</li>
//                     <li><strong>Pickup Address:</strong> ${user.address || "Not specified"}</li>
//                     <li><strong>Destination:</strong> ${shelter.name}, ${shelter.address}, ${shelter.city}</li>
//                 </ul>
//                 <p><a href="/shelters">← Back to Shelters</a></p>
//             </div>
//         `);
//     } catch (error) {
//         console.error("Error submitting donation:", error);
//         res.status(500).send("Failed to submit donation.");
//     }
// });

// // ====================================================================
// //                          /TEST-ADD-SHELTER ROUTE
// // ====================================================================

// app.get("/test-add-shelter", async (req, res) => {
//     try {
//         const testShelterName = "Community Food Bank East";
//         const dummyPassword = await bcrypt.hash("test-password-123", 10);

//         const data = {
//             name: testShelterName,
//             password: dummyPassword,
//             address: "123 Hunger Relief St",
//             city: "Metropolis",
//             contactPerson: "Jane Doe",
//             contactPhone: "555-123-9876",
//             status: "Accepting Donations",
//             notes: "Available for large drop-offs only after 3 PM.",
//         };

//         const existing = await FoodShelter.findOne({ name: testShelterName });
//         if (!existing) {
//             await FoodShelter.create(data);
//             return res.send(`<h2 style="color:green;">✅ Inserted ${data.name}</h2>`);
//         } else {
//             return res.send(`<h2 style="color:blue;">ℹ️ ${data.name} already exists.</h2>`);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Failed to add test shelter.");
//     }
// });
// app.get("/shelter/register", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Food Shelter Registration</title>
//       <script src="https://cdn.tailwindcss.com"></script>
//       <style>
//         body { background-color: #f9fafb; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
//         .register-box { background: white; padding: 2.5rem; border-radius: 0.75rem; box-shadow: 0 10px 15px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
//         input, textarea, select {
//           width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; margin-bottom: 1rem;
//         }
//         button {
//           width: 100%; padding: 0.75rem; background-color: #16a34a; color: white; font-weight: 600;
//           border-radius: 0.375rem; transition: background-color 0.2s;
//         }
//         button:hover { background-color: #15803d; }
//       </style>
//     </head>
//     <body>
//       <div class="register-box">
//         <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">🍲 Food Shelter Registration</h1>
//         <form method="POST" action="/shelter/register">
//           <input type="text" name="name" placeholder="Shelter Name" required />
//           <input type="password" name="password" placeholder="Password" required />
//           <input type="text" name="address" placeholder="Address" required />
//           <input type="text" name="city" placeholder="City" required />
//           <input type="text" name="contactPerson" placeholder="Contact Person" required />
//           <input type="text" name="contactPhone" placeholder="Contact Phone" required />
//           <select name="status" required>
//             <option value="Accepting Donations">Accepting Donations</option>
//             <option value="Temporarily Full">Temporarily Full</option>
//             <option value="Closed for Maintenance">Closed for Maintenance</option>
//           </select>
//           <textarea name="notes" placeholder="Additional Notes (optional)" rows="3"></textarea>
//           <button type="submit">Register Shelter</button>
//         </form>
//         <p class="text-center mt-4 text-sm text-gray-600">
//           Already registered? <a href="/shelter/login" class="text-green-600 font-semibold">Login here</a>
//         </p>
//       </div>
//     </body>
//     </html>
//   `);
// });
// app.post("/shelter/register", async (req, res) => {
//   try {
//     const { name, password, address, city, contactPerson, contactPhone, status, notes } = req.body;

//     if (!name || !password || !address || !city || !contactPerson || !contactPhone) {
//       return res.status(400).send("<h2 style='color:red;'>❌ Missing required fields.</h2>");
//     }

//     // check for existing shelter
//     const existing = await FoodShelter.findOne({ name });
//     if (existing) {
//       return res.send(`<h2 style="color:blue;">ℹ️ Shelter "${name}" already registered. Try logging in.</h2>`);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await FoodShelter.create({
//       name,
//       password: hashedPassword,
//       address,
//       city,
//       contactPerson,
//       contactPhone,
//       status,
//       notes,
//     });

//     res.send(`
//       <h2 style="color:green;">✅ Registration successful!</h2>
//       <p><a href="/shelter/login">Click here to log in</a></p>
//     `);
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).send("<h2 style='color:red;'>❌ Server error during registration.</h2>");
//   }
// });
// app.get("/shelter/login", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>Shelter Login</title>
//       <script src="https://cdn.tailwindcss.com"></script>
//     </head>
//     <body class="bg-gray-100 flex justify-center items-center min-h-screen">
//       <div class="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">🍲 Shelter Login</h1>
//         <form method="POST" action="/shelter/login">
//           <input type="text" name="name" placeholder="Shelter Name" class="w-full mb-4 p-2 border rounded" required>
//           <input type="password" name="password" placeholder="Password" class="w-full mb-4 p-2 border rounded" required>
//           <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Login</button>
//         </form>
//       </div>
//     </body>
//     </html>
//   `);
// });

// app.post("/shelter/login", async (req, res) => {
//   const { name, password } = req.body;
//   const shelter = await FoodShelter.findOne({ name });

//   if (!shelter) return res.status(404).send("Shelter not found.");

//   const match = await bcrypt.compare(password, shelter.password);
//   if (!match) return res.status(401).send("Invalid password.");

//   res.send(`<h2>Welcome, ${shelter.name}! ✅</h2>`);
// });

// // ====================================================================
// //                          /ORDERS/MY ROUTE
// // ====================================================================

// app.get("/orders/my", async (req, res) => {
//     const userId = req.session.userId;
//     if (!userId) return res.status(401).json({ error: "Not logged in" });

//     try {
//         const user = await User.findById(userId);
//         if (!user) return res.status(401).json({ error: "Invalid session" });

//         const orders = await LiveOrder.find({ userEmail: user.email })
//             .populate("restaurantId", "name")
//             .sort({ createdAt: -1 })
//             .lean();

//         const formatted = orders.map(o => ({
//             id: o._id.toString().slice(-6),
//             restaurantName: o.restaurantId?.name || "Unknown",
//             total: o.total.toFixed(2),
//             status: o.status,
//             itemsCount: o.items?.length || 0,
//         }));

//         res.json(formatted);
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ error: "Failed to fetch orders." });
//     }
// });
// // CANCEL ORDER (User)
// app.post("/orders/:id/cancel", async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     if (!userId) return res.status(401).send("Not logged in");

//     const order = await LiveOrder.findById(req.params.id);
//     if (!order) return res.status(404).send("Order not found");

//     if (["Delivered", "Out for Delivery", "Cancelled"].includes(order.status)) {
//       return res.status(400).send("Cannot cancel this order.");
//     }

//     order.status = "Cancelled";
//     await order.save();

//     res.send(`✅ Order ${order._id.toString().slice(-6)} cancelled successfully!`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error cancelling order.");
//   }
// });


// app.get("/restaurants", async (req, res) => {
//   const rests = await Restaurant.find().lean();
//   const restaurantsJson = JSON.stringify(rests.map(r => ({
//     _id: r._id.toString(),
//     name: r.name,
//     type: r.type || "Normal",
//     cuisine: r.cuisine || "Mixed",
//     address: r.address || "N/A"
//   })));

//   res.send(`
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Find Restaurants</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//       body { font-family: 'Inter', sans-serif; }
//       .orders-overlay {
//         position: fixed;
//         top: 0; left: 0; width: 100%; height: 100%;
//         background-color: rgba(0,0,0,0.7);
//         display: none; justify-content: center; align-items: center;
//         z-index: 50;
//       }
//       .order-item { border-bottom: 1px solid #e5e7eb; }
//       .status-tag {
//         padding: 4px 10px; border-radius: 9999px; font-weight: 600;
//         font-size: 0.8rem;
//       }
//       .status-preparing { background-color: #fef3c7; color: #b45309; }
//       .status-ready { background-color: #dbeafe; color: #1e40af; }
//       .status-out { background-color: #cffafe; color: #065f46; }
//       .status-delivered { background-color: #d1fae5; color: #065f46; }
//       .status-cancelled { background-color: #fee2e2; color: #991b1b; }
//     </style>
//   </head>
//   <body class="bg-gray-50">
//     <div class="max-w-7xl mx-auto p-6">

//       <div class="flex justify-between items-center py-4 border-b border-gray-200 mb-8">
//         <h2 class="text-3xl font-extrabold text-gray-900 flex items-center">
//           <span class="mr-3 text-4xl">🍽</span> Find a Restaurant
//         </h2>
//         <div class="flex gap-4">
//           <a href="/cart" class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center gap-1">
//             🛒 Cart
//           </a>
//           <button id="view-orders-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center gap-1">
//             📦 My Orders
//           </button>
//           <button onclick="document.getElementById('logout-form').submit()" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center gap-1">
//             🚪 Logout
//           </button>
//           <form id="logout-form" method="POST" action="/logout" style="display:none;"></form>
//         </div>
//       </div>

//       <div class="mb-8">
//         <input type="text" id="search-input" placeholder="Search by restaurant name, cuisine, or type..."
//                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150">
//       </div>

//       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="restaurant-list"></div>

//       <!-- 🗺️ Google Map Section -->
//       <div class="mt-12">
//         <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">📍 Restaurant Map</h2>
//         <div id="map" class="rounded-xl shadow-md border border-gray-200" style="width:100%;height:400px;"></div>
//       </div>

//       <!-- 🪑 Table Booking Section -->
//       <div class="mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
//         <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">🪑 Book a Table</h2>
//         <form method="POST" action="/book-table" class="space-y-4 max-w-md">
//           <input name="name" type="text" placeholder="Your Name" required class="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//           <input name="email" type="email" placeholder="Email Address" required class="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//           <input name="phone" type="text" placeholder="Phone Number" required class="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//           <div class="flex gap-4">
//             <input name="date" type="date" required class="w-1/2 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//             <input name="time" type="time" required class="w-1/2 border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//           </div>
//           <input name="guests" type="number" placeholder="Number of Guests" min="1" max="10" required class="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
//           <textarea name="specialRequest" rows="2" placeholder="Any special request?" class="w-full border p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
//           <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 w-full">
//             Confirm Booking
//           </button>
//         </form>
//       </div>
//     </div>

//     <!-- Overlay for Orders -->
//     <div id="orders-overlay" class="orders-overlay">
//       <div class="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
//         <h3 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">📦 Your Order History</h3>
//         <div id="orders-list" class="space-y-3">Loading orders...</div>
//         <button onclick="document.getElementById('orders-overlay').style.display='none'" 
//                 class="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition duration-150">
//           Close
//         </button>
//       </div>
//     </div>

//     <!-- Google Maps Script -->
//     <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
//     <script>
//       function initMap() {
//         const restaurant = { lat: 19.0760, lng: 72.8777 }; // Example: Mumbai
//         const user = { lat: 19.2183, lng: 72.9781 }; // Example: User area
//         const map = new google.maps.Map(document.getElementById("map"), {
//           zoom: 11, center: restaurant
//         });
//         new google.maps.Marker({ position: restaurant, map, label: "🍴" });
//         new google.maps.Marker({ position: user, map, label: "🏠" });
//       }
//     </script>

//     <!-- Existing Client Logic -->
//     <script>
//       const allRestaurants = ${restaurantsJson};
//       const restaurantList = document.getElementById('restaurant-list');
//       const searchInput = document.getElementById('search-input');
//       const viewOrdersBtn = document.getElementById('view-orders-btn');
//       const ordersOverlay = document.getElementById('orders-overlay');
//       const ordersList = document.getElementById('orders-list');

//       function getTagClasses(type) {
//         return type === 'Home' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800';
//       }
//       function getStatusTagClass(status) {
//         switch(status) {
//           case 'Preparing': return 'status-preparing';
//           case 'Ready': return 'status-ready';
//           case 'Out for Delivery': return 'status-out';
//           case 'Delivered': return 'status-delivered';
//           default: return 'status-cancelled';
//         }
//       }
//       function createRestaurantCard(r) {
//         const tagClasses = getTagClasses(r.type);
//         return \`
//           <div class="restaurant-card bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition duration-200">
//             <div class="text-xl font-bold text-gray-900 mb-1">\${r.name}</div>
//             <div class="flex items-center space-x-2 mb-3">
//               <span class="text-xs font-semibold px-3 py-1 rounded-full \${tagClasses}">
//                 \${r.type === 'Home' ? '🏡 Home Kitchen' : '🏢 Normal Restaurant'}
//               </span>
//             </div>
//             <div class="text-sm text-gray-500 space-y-1">
//               <div>Cuisine: <span class="font-medium text-gray-700">\${r.cuisine}</span></div>
//               <div>Address: <span class="font-medium text-gray-700">\${r.address.split(',')[0] || "See Details"}</span></div>
//             </div>
//             <a href="/menu/\${r._id}" class="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 text-sm w-full text-center">
//               View Menu & Order →
//             </a>
//           </div>
//         \`;
//       }
//       function renderOrderItem(order) {
//         const statusClass = getStatusTagClass(order.status);
//         return \`
//           <div class="order-item p-3 flex justify-between items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-100">
//             <div>
//               <div class="font-bold text-gray-800">#\${order._id} <span class="text-sm font-normal text-gray-600">from \${order.restaurantName}</span></div>
//               <div class="text-xs text-gray-500">\${order.itemsCount} items | Total: ₹\${order.total}</div>
//             </div>
//             <span class="status-tag \${statusClass}">\${order.status}</span>
//           </div>
//         \`;
//       }
//       async function fetchAndDisplayOrders() {
//         ordersOverlay.style.display = 'flex';
//         ordersList.innerHTML = '<div class="p-4 text-center text-gray-500">Fetching your recent orders...</div>';
//         try {
//           const response = await fetch('/orders/my');
//           if (!response.ok) throw new Error('Network response was not ok');
//           const orders = await response.json();
//           if (orders.length === 0) {
//             ordersList.innerHTML = '<div class="p-6 text-center text-gray-500">You have no current or past orders. Start ordering now!</div>';
//             return;
//           }
//           ordersList.innerHTML = orders.map(renderOrderItem).join('');
//         } catch (error) {
//           console.error("Error fetching orders:", error);
//           ordersList.innerHTML = '<div class="p-6 text-center text-red-500 font-medium">Failed to load orders. Please try refreshing.</div>';
//         }
//       }
//       function renderRestaurants(restaurantsToRender) {
//         restaurantList.innerHTML = ''; 
//         if (restaurantsToRender.length === 0) {
//           restaurantList.innerHTML = '<div class="col-span-full p-10 text-center text-gray-500 text-lg">No restaurants found.</div>';
//           return;
//         }
//         restaurantsToRender.forEach(r => {
//           restaurantList.insertAdjacentHTML('beforeend', createRestaurantCard(r));
//         });
//       }
//       function filterRestaurants() {
//         const searchTerm = searchInput.value.toLowerCase().trim();
//         const filtered = allRestaurants.filter(r => {
//           const s = \`\${r.name} \${r.type} \${r.cuisine} \${r.address}\`.toLowerCase();
//           return s.includes(searchTerm);
//         });
//         renderRestaurants(filtered);
//       }
//       searchInput.addEventListener('input', filterRestaurants);
//       viewOrdersBtn.addEventListener('click', fetchAndDisplayOrders);
//       window.onload = () => renderRestaurants(allRestaurants);
//     </script>
//   </body>
//   </html>
//   `);
// });

// // ==============================================================================
// // 2. UPDATED ROUTE: Restaurant List Page (Customer View with Tailwind UI)
// // ==============================================================================

// // ==============================================================================
// // 3. LOGOUT ROUTE (Retained)
// // ==============================================================================
// app.post("/logout", (req, res) => {
//     // 1. Destroy the user's session
//     req.session.destroy(err => {
//         if (err) {
//             console.error("Error destroying session:", err);
//             return res.redirect("/");
//         }
//         
//         // 2. Clear any session-related cookies
//         res.clearCookie('connect.sid'); 

//         // 3. Redirect the user to the homepage
//         res.redirect("/");
//     });
// });


// // ---------- MENU ----------

// app.get("/menu/:id", async (req, res) => {
//   const r = await Restaurant.findById(req.params.id);
//   // NOTE: You must define the 'esc' function globally or ensure it's available here
//   const safeName = r ? (typeof esc === 'function' ? esc(r.name) : r.name) : 'Restaurant Menu';
//   const menu = await Menu.find({ restaurantId: r._id }).lean();
//   const cartCount = (req.session.cart || []).reduce((s, i) => s + i.quantity, 0);

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>${safeName} - Menu</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f8f9fa;
//           margin: 0;
//           padding: 0;
//         }
//         .container {
//           max-width: 900px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px 0;
//           border-bottom: 2px solid #e9ecef;
//           margin-bottom: 20px;
//         }
//         h2 {
//           color: #343a40;
//           font-weight: 700;
//           margin: 0;
//         }
//         .cart-link {
//           text-decoration: none;
//           color: white;
//           background-color: #0022ffff; /* Primary accent color */
//           padding: 10px 15px;
//           border-radius: 8px;
//           font-weight: 600;
//           transition: background-color 0.2s;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//         }
//         .cart-link:hover {
//           background-color: #00e664ff;
//         }
//         .menu-list {
//           display: grid;
//           gap: 15px;
//         }
//         .menu-item-card {
//           background: #ffffff;
//           padding: 20px;
//           border-radius: 12px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .item-details {
//           flex-grow: 1;
//         }
//         .item-name {
//           font-size: 1.3em;
//           font-weight: 700;
//           color: #343a40;
//           margin-bottom: 4px;
//         }
//         .item-price {
//           font-size: 1.1em;
//           font-weight: 600;
//           color: #28a745; /* Price color */
//         }
//         .add-to-cart-form {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .add-to-cart-form input[type="number"] {
//           width: 60px;
//           padding: 8px;
//           border: 1px solid #ced4da;
//           border-radius: 6px;
//           text-align: center;
//         }
//         .add-to-cart-form button {
//           background-color: #007bff;
//           color: white;
//           border: none;
//           padding: 8px 15px;
//           border-radius: 6px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }
//         .add-to-cart-form button:hover {
//           background-color: #0056b3;
//         }
//         .back-link {
//           display: block;
//           margin-top: 30px;
//           font-weight: 600;
//           color: #6c757d;
//           text-decoration: none;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h2>🍽 ${safeName} Menu</h2>
//           <a href="/cart" class="cart-link">
//             🛒 Cart (${cartCount})
//           </a>
//         </div>
        
//         <div class="menu-list">
//           ${menu
//             .map(
//               (m) => `
//             <div class="menu-item-card">
//               <div class="item-details">
//                 <div class="item-name">${typeof esc === 'function' ? esc(m.name) : m.name}</div>
//                 <div class="item-price">₹${m.price}</div>
//               </div>
//               <form method="POST" action="/cart/add" class="add-to-cart-form">
//                 <input type="hidden" name="itemId" value="${m._id}">
//                 <input type="hidden" name="restaurantId" value="${r._id}">
//                 <input type="hidden" name="itemName" value="${typeof esc === 'function' ? esc(m.name) : m.name}">
//                 <input type="hidden" name="price" value="${m.price}">
//                 <input type="number" name="quantity" min="1" value="1">
//                 <button type="submit">Add to Cart</button>
//               </form>
//             </div>`
//             )
//             .join("")}
//         </div>
        
//         <a href="/restaurants" class="back-link">⬅ Back to Restaurants</a>
//       </div>
//     </body>
//     </html>`);
// });

// // ---------- CART ----------

// app.get("/cart", async (req, res) => {
//   const cart = req.session.cart || [];
//   const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

//   if (!cart.length)
//     return res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Cart is Empty</title>
//           <style>
//               body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; text-align: center; }
//               .empty-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
//               h3 { color: #343a40; margin-bottom: 20px; }
//               .browse-link { text-decoration: none; color: #007bff; font-weight: 600; padding: 10px 15px; border: 1px solid #007bff; border-radius: 6px; transition: background-color 0.2s; }
//               .browse-link:hover { background-color: #f0f8ff; }
//           </style>
//       </head>
//       <body>
//           <div class="empty-container">
//               <h3>🛍️ Your cart is empty!</h3>
//               <a href='/restaurants' class="browse-link">⬅ Browse Restaurants</a>
//           </div>
//       </body>
//       </html>
//     `);

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Your Shopping Cart</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f8f9fa;
//           margin: 0;
//           padding: 20px;
//         }
//         .container {
//           max-width: 800px;
//           margin: 0 auto;
//           background: #ffffff;
//           padding: 30px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//         }
//         h2 {
//           color: #343a40;
//           font-weight: 700;
//           border-bottom: 2px solid #e9ecef;
//           padding-bottom: 10px;
//           margin-bottom: 25px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .cart-list {
//           list-style: none;
//           padding: 0;
//         }
//         .cart-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px 0;
//           border-bottom: 1px solid #eee;
//         }
//         .item-info {
//           flex-grow: 1;
//           font-size: 1.1em;
//           color: #343a40;
//         }
//         .item-name {
//           font-weight: 600;
//         }
//         .item-quantity-price {
//             font-size: 0.9em;
//             color: #6c757d;
//             margin-top: 2px;
//         }
//         .item-total {
//           font-weight: 700;
//           color: #28a745; /* Green for item total */
//           min-width: 80px;
//           text-align: right;
//         }
//         .item-controls form {
//           display: inline-flex;
//           gap: 5px;
//         }
//         .item-controls button {
//           padding: 6px 10px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: background-color 0.2s;
//         }
//         .item-controls button[value="increase"] { background-color: #d4edda; color: #155724; border-color: #c3e6cb; }
//         .item-controls button[value="decrease"] { background-color: #fff3cd; color: #856404; border-color: #ffeeba; }
//         .item-controls button[value="remove"] { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
//         .item-controls button:hover { opacity: 0.8; }

//         .summary {
//           border-top: 3px solid #ff6f00; /* Accent color for summary */
//           padding-top: 20px;
//           margin-top: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .summary h3 {
//           font-size: 1.5em;
//           color: #343a40;
//           margin: 0;
//         }
//         .summary-total {
//           font-size: 1.8em;
//           font-weight: 700;
//           color: #ff6f00;
//         }
//         .actions {
//           margin-top: 30px;
//           display: flex;
//           gap: 15px;
//           align-items: center;
//         }
//         .actions button {
//           padding: 12px 20px;
//           border: none;
//           border-radius: 8px;
//           font-size: 1em;
//           font-weight: 700;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }
//         .actions button[type="submit"] {
//           background-color: #28a745; /* Place Order */
//           color: white;
//           flex-grow: 1;
//         }
//         .actions button[type="submit"]:hover { background-color: #1e7e34; }
        
//         .actions form:nth-child(2) button {
//           background-color: #6c757d; /* Clear Cart */
//           color: white;
//         }
//         .actions form:nth-child(2) button:hover { background-color: #5a6268; }
        
//         .continue-shopping {
//             text-decoration: none;
//             color: #007bff;
//             font-weight: 600;
//             margin-left: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>🛒 Your Shopping Cart</h2>
        
//         <div class="cart-list">
//           ${cart
//             .map(
//               (i) => `
//             <li class="cart-item">
//               <div class="item-info">
//                 <div class="item-name">${typeof esc === 'function' ? esc(i.itemName) : i.itemName}</div>
//                 <div class="item-quantity-price">${i.quantity} @ ₹${i.price.toFixed(2)} each</div>
//               </div>

//               <div class="item-controls">
//                 <form method="POST" action="/cart/update">
//                   <input type="hidden" name="itemId" value="${i.itemId}">
//                   <button name="action" value="increase">+</button>
//                   <button name="action" value="decrease">-</button>
//                   <button name="action" value="remove">Remove</button>
//                 </form>
//               </div>

//               <div class="item-total">
//                 ₹${(i.price * i.quantity).toFixed(2)}
//               </div>
//             </li>`
//             )
//             .join("")}
//         </div>
        
//         <div class="summary">
//           <h3>Order Total:</h3>
//           <span class="summary-total">₹${total.toFixed(2)}</span>
//         </div>

//         <div class="actions">
//           <form method="POST" action="/order/confirm">
//             <button type="submit">Place Order ✅</button>
//           </form>
          
//           <form method="POST" action="/cart/clear">
//             <button type="submit">Clear Cart</button>
//           </form>
          
//           <a href="/restaurants" class="continue-shopping">⬅ Continue Shopping</a>
//         </div>
//       </div>
//     </body>
//     </html>`);
// });

// app.post("/cart/add", (req, res) => {
//   const { itemId, restaurantId, itemName, price, quantity } = req.body;
//   if (!req.session.cart) req.session.cart = [];
  
//   // Find existing item in cart
//   const existing = req.session.cart.find((i) => i.itemId === itemId);
  
//   if (existing) {
//     existing.quantity += parseInt(quantity);
//   } else {
//     req.session.cart.push({
//       itemId,
//       restaurantId,
//       itemName,
//       price: parseFloat(price),
//       quantity: parseInt(quantity),
//     });
//   }
//   res.redirect("/cart");
// });

// app.post("/cart/update", (req, res) => {
//   const { itemId, action } = req.body;
//   const cart = req.session.cart || [];
//   const idx = cart.findIndex((i) => i.itemId === itemId);
  
//   if (idx !== -1) {
//     if (action === "increase") cart[idx].quantity++;
//     if (action === "decrease") {
//       cart[idx].quantity--;
//       if (cart[idx].quantity <= 0) cart.splice(idx, 1);
//     }
//     if (action === "remove") cart.splice(idx, 1);
//   }
  
//   req.session.cart = cart;
//   res.redirect("/cart");
// });

// app.post("/cart/clear", (req, res) => {
//   req.session.cart = [];
//   res.redirect("/cart");
// });

// // ---------- PLACE ORDER ----------

// app.get("/cart", async (req, res) => {
//   const cart = req.session.cart || [];
//   const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

//   if (!cart.length)
//     return res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Cart is Empty</title>
//           <style>
//               body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; text-align: center; }
//               .empty-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
//               h3 { color: #343a40; margin-bottom: 20px; }
//               .browse-link { text-decoration: none; color: #007bff; font-weight: 600; padding: 10px 15px; border: 1px solid #007bff; border-radius: 6px; transition: background-color 0.2s; }
//               .browse-link:hover { background-color: #f0f8ff; }
//           </style>
//       </head>
//       <body>
//           <div class="empty-container">
//               <h3>🛍️ Your cart is empty!</h3>
//               <a href='/restaurants' class="browse-link">⬅ Browse Restaurants</a>
//           </div>
//       </body>
//       </html>
//     `);

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Your Shopping Cart</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f8f9fa;
//           margin: 0;
//           padding: 20px;
//         }
//         .container {
//           max-width: 800px;
//           margin: 0 auto;
//           background: #ffffff;
//           padding: 30px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//         }
//         h2 {
//           color: #343a40;
//           font-weight: 700;
//           border-bottom: 2px solid #e9ecef;
//           padding-bottom: 10px;
//           margin-bottom: 25px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .cart-list {
//           list-style: none;
//           padding: 0;
//         }
//         .cart-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px 0;
//           border-bottom: 1px solid #eee;
//         }
//         .item-info {
//           flex-grow: 1;
//           font-size: 1.1em;
//           color: #343a40;
//         }
//         .item-name {
//           font-weight: 600;
//         }
//         .item-quantity-price {
//             font-size: 0.9em;
//             color: #6c757d;
//             margin-top: 2px;
//         }
//         .item-total {
//           font-weight: 700;
//           color: #28a745; 
//           min-width: 80px;
//           text-align: right;
//         }
//         .item-controls form {
//           display: inline-flex;
//           gap: 5px;
//         }
//         .item-controls button {
//           padding: 6px 10px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           cursor: pointer;
//           font-weight: 600;
//           transition: background-color 0.2s;
//         }
//         .item-controls button[value="increase"] { background-color: #d4edda; color: #155724; border-color: #c3e6cb; }
//         .item-controls button[value="decrease"] { background-color: #fff3cd; color: #856404; border-color: #ffeeba; }
//         .item-controls button[value="remove"] { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
//         .item-controls button:hover { opacity: 0.8; }

//         .summary {
//           border-top: 3px solid #ff6f00; 
//           padding-top: 20px;
//           margin-top: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//         .summary h3 {
//           font-size: 1.5em;
//           color: #343a40;
//           margin: 0;
//         }
//         .summary-total {
//           font-size: 1.8em;
//           font-weight: 700;
//           color: #ff6f00;
//         }
//         .actions {
//           margin-top: 30px;
//           display: flex;
//           gap: 15px;
//           align-items: center;
//         }
//         .actions form {
//             flex-grow: 1;
//         }
//         .actions button {
//           width: 100%;
//           padding: 12px 20px;
//           border: none;
//           border-radius: 8px;
//           font-size: 1em;
//           font-weight: 700;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }
//         .actions button.place-order-btn {
//           background-color: #28a745; 
//           color: white;
//         }
//         .actions button.place-order-btn:hover { background-color: #1e7e34; }
        
//         .actions button.clear-cart-btn {
//           background-color: #dc3545; /* Red for destructive action */
//           color: white;
//         }
//         .actions button.clear-cart-btn:hover { background-color: #c82333; }
        
//         .continue-shopping {
//             text-decoration: none;
//             color: #007bff;
//             font-weight: 600;
//             margin-left: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>🛒 Your Shopping Cart</h2>
        
//         <div class="cart-list">
//           ${cart
//             .map(
//               (i) => `
//             <li class="cart-item">
//               <div class="item-info">
//                 <div class="item-name">${typeof esc === 'function' ? esc(i.itemName) : i.itemName}</div>
//                 <div class="item-quantity-price">${i.quantity} @ ₹${i.price.toFixed(2)} each</div>
//               </div>

//               <div class="item-controls">
//                 <form method="POST" action="/cart/update">
//                   <input type="hidden" name="itemId" value="${i.itemId}">
//                   <button name="action" value="increase">+</button>
//                   <button name="action" value="decrease">-</button>
//                   <button name="action" value="remove">Remove</button>
//                 </form>
//               </div>

//               <div class="item-total">
//                 ₹${(i.price * i.quantity).toFixed(2)}
//               </div>
//             </li>`
//             )
//             .join("")}
//         </div>
        
//         <div class="summary">
//           <h3>Order Total:</h3>
//           <span class="summary-total">₹${total.toFixed(2)}</span>
//         </div>

//         <div class="actions">
//           <form method="POST" action="/order/confirm">
//             <button type="submit" class="place-order-btn">Place Order ✅</button>
//           </form>
          
//           <form method="POST" action="/cart/clear">
//             <button type="submit" class="clear-cart-btn">Clear Cart</button>
//           </form>
          
//           <a href="/restaurants" class="continue-shopping">⬅ Continue Shopping</a>
//         </div>
//       </div>
//     </body>
//     </html>`);
// });


// app.post("/order/confirm", async (req, res) => {
//     const cart = req.session.cart || [];
//     if (!cart.length) return res.send("Cart empty.");
    
//     // 1. --- FETCH USER ID & EMAIL ---
//     const userId = req.session.userId;
//     if (!userId) {
//         // Stop and require login if userId is missing
//         return res.status(401).send("You must be logged in to place an order.");
//     }
    
//     // Fetch user details to get the email (assuming User model is imported)
//     const user = await User.findById(userId); 
//     if (!user) {
//         return res.status(404).send("User session invalid. Please log in again.");
//     }
    
//     const grouped = {};
//     cart.forEach((i) => {
//       if (!grouped[i.restaurantId]) grouped[i.restaurantId] = [];
//       grouped[i.restaurantId].push(i);
//     });

//     let overallTotal = 0;
    
//     // Process and save all orders
//     for (const [rId, items] of Object.entries(grouped)) {
//       const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
//       overallTotal += total;
      
//       try {
//         await new LiveOrder({
//           // ⭐️ FIX: Supply the required userId and userEmail ⭐️
//           userId: user._id, 
//           userEmail: user.email, // Kept for backward compatibility/admin view
          
//           restaurantId: rId,
//           items,
//           total,
//           status: "Placed",
//         }).save();
//       } catch (error) {
//           // Log the error and stop the process if one order fails
//           console.error("CRITICAL ORDER SAVE ERROR:", error);
//           return res.status(500).send("Failed to save order due to server error. Please check logs.");
//       }
//     }

//     req.session.cart = [];
    
//     res.send(`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Order Confirmed!</title>
//           <style>
//             body {
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//               background-color: #e6f7ff; 
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               min-height: 100vh;
//               margin: 0;
//             }
//             .confirm-container {
//               background: #ffffff;
//               padding: 50px;
//               border-radius: 12px;
//               box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//               width: 100%;
//               max-width: 450px; 
//               text-align: center;
//               border-top: 5px solid #28a745; 
//             }
//             h2 {
//               color: #28a745;
//               font-size: 2.2em;
//               margin-bottom: 10px;
//             }
//             p {
//               color: #555;
//               font-size: 1.1em;
//               line-height: 1.6;
//             }
//             .total-box {
//                 margin: 25px 0;
//                 padding: 15px;
//                 background-color: #f0fff0;
//                 border: 1px solid #c3e6cb;
//                 border-radius: 8px;
//             }
//             .total-box strong {
//                 font-size: 1.5em;
//                 color: #28a745;
//             }
//             .action-link {
//               display: inline-block;
//               margin-top: 25px;
//               padding: 12px 25px;
//               background-color: #007bff; 
//               color: white;
//               border-radius: 8px;
//               text-decoration: none;
//               font-weight: 600;
//               transition: background-color 0.2s;
//             }
//             .action-link:hover {
//               background-color: #0056b3;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="confirm-container">
//             <h2>🎉 Order Confirmed!</h2>
//             <p>Your meal is being prepared and will be dispatched soon.</p>
            
//             <div class="total-box">
//                 <p style="margin: 0; color: #343a40;">Total Amount:</p>
//                 <strong>₹${overallTotal.toFixed(2)}</strong>
//                 <p style="margin: 5px 0 0; font-size: 0.9em; color: #555;">(Payment assumed to be handled upon delivery)</p>
//             </div>
            
//             <p>You have successfully placed ${Object.keys(grouped).length} order(s) with our partners.</p>

//             <a href='/restaurants' class="action-link">Start a New Order</a>
//           </div>
//         </body>
//         </html>
//     `);
// });
// // ---------- RESTAURANT DASHBOARD ----------

// app.get("/restaurant/:id/orders", async (req, res) => {
//   // 1. Check for logged-in status (required for real-world app, assuming middleware handles this)
//   const restaurantId = req.params.id;

//   // 2. Fetch all necessary data
//   const orders = await LiveOrder.find({ restaurantId })
//     .sort({ createdAt: -1 })
//     .populate("deliveryPartnerId", "name email")
//     .lean();

//   const menuItems = await Menu.find({ restaurantId }).lean();
  
//   // Helper function for status color (using a switch is cleaner but inline check works too)
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Placed': return 'status-placed';
//       case 'Accepted': return 'status-accepted';
//       case 'Preparing': return 'status-preparing';
//       case 'Ready': return 'status-ready';
//       case 'Out for Delivery': return 'status-out';
//       case 'Delivered': return 'status-delivered';
//       default: return 'status-default';
//     }
//   };

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Partner Dashboard</title>
//       <style>
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f8f9fa;
//           margin: 0;
//           padding: 20px;
//         }
//         .container {
//           max-width: 1100px;
//           margin: 0 auto;
//           background: #ffffff;
//           padding: 30px;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//         }
//         .header-section {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 25px;
//           border-bottom: 2px solid #e9ecef;
//           padding-bottom: 10px;
//         }
//         h2 {
//           color: #343a40;
//           font-weight: 700;
//           margin: 0;
//         }
//         .logout-btn {
//           background-color: #dc3545; /* Red for logout */
//           color: white;
//           border: none;
//           padding: 8px 15px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-weight: 600;
//           text-decoration: none;
//           transition: background-color 0.2s;
//         }
//         .logout-btn:hover {
//           background-color: #c82333;
//         }

//         /* --- Tabs and Content (Retained Styling) --- */
//         .tabs {
//           display: flex;
//           border-bottom: 2px solid #e9ecef;
//           margin-bottom: 20px;
//         }
//         .tab-button {
//           padding: 12px 20px;
//           cursor: pointer;
//           font-weight: 600;
//           font-size: 1.1em;
//           color: #6c757d;
//           background: none;
//           border: none;
//           border-bottom: 3px solid transparent;
//           transition: all 0.2s;
//         }
//         .tab-button.active {
//           color: #ff6f00;
//           border-bottom: 3px solid #ff6f00;
//         }
//         .tab-content {
//           display: none;
//         }
//         .tab-content.active {
//           display: block;
//         }

//         /* --- Order Card Styles (Retained Styling) --- */
//         .order-card {
//           background: #fff;
//           border: 1px solid #dee2e6;
//           padding: 20px;
//           margin-bottom: 15px;
//           border-radius: 8px;
//           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
//         }
//         .order-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 15px;
//           border-bottom: 1px dashed #eee;
//           padding-bottom: 10px;
//         }
//         .order-id { font-size: 0.9em; color: #6c757d; }
//         .order-user { font-weight: 600; }
        
//         .status-tag {
//           padding: 5px 10px;
//           border-radius: 5px;
//           font-weight: 700;
//           text-transform: uppercase;
//           font-size: 0.8em;
//         }
//         .status-placed { background-color: #ffe5b4; color: #cc6600; } 
//         .status-accepted { background-color: #a0c4ff; color: #0056b3; }
//         .status-preparing { background-color: #ffb861; color: #ff6f00; }
//         .status-ready { background-color: #d4edda; color: #155724; }
//         .status-out { background-color: #ffc107; color: #856404; }
//         .status-delivered { background-color: #28a745; color: white; }
//         .status-default { background-color: #f8f9fa; color: #6c757d; }

//         .item-list { list-style: none; padding: 0; margin-top: 10px; }
//         .item-list li { margin-bottom: 3px; font-size: 0.95em; color: #555; }
        
//         .order-actions form { display: inline-block; margin-right: 10px; }
//         .order-actions button {
//           background-color: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background-color 0.2s;
//         }
//         .order-actions button:hover { background-color: #0056b3; }
        
//         /* --- Menu Management Styles (Retained Styling) --- */
//         .menu-grid {
//             display: grid;
//             grid-template-columns: 1fr 2fr;
//             gap: 30px;
//         }
//         .add-item-form {
//             background: #fffaf5;
//             padding: 20px;
//             border-radius: 8px;
//             border: 1px solid #ff6f0020;
//         }
//         .add-item-form h4 { color: #ff6f00; margin-top: 0; border-bottom: 1px solid #ff6f0020; padding-bottom: 10px; margin-bottom: 20px; }
//         .add-item-form input[type="text"], .add-item-form input[type="number"], .add-item-form textarea {
//             width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;
//         }
//         .add-item-form label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9em; }
//         .add-item-form button { background-color: #28a745; margin-top: 10px; }
//         .add-item-form button:hover { background-color: #1e7e34; }
//         .menu-list-container { max-height: 700px; overflow-y: auto; padding-right: 10px; }
        
//         .menu-item-card {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 15px;
//             border: 1px solid #eee;
//             margin-bottom: 10px;
//             border-radius: 8px;
//         }
//         .item-details { flex-grow: 1; }
//         .item-name-price { font-weight: 700; font-size: 1.1em; color: #343a40; }
//         .item-category { font-size: 0.85em; color: #6c757d; }
//         .menu-item-card .actions button {
//             background-color: #dc3545; color: white; padding: 6px 12px; font-size: 0.9em; margin-left: 5px;
//         }
//         .menu-item-card .actions button.edit-btn { background-color: #17a2b8; }
        
//         /* Edit Form Styling */
//         .edit-form-toggle { display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee; }
//         .edit-form-toggle input[type="text"], .edit-form-toggle input[type="number"], .edit-form-toggle textarea {
//             width: calc(100% - 22px); 
//         }

//       </style>
//       <script>
//         // Client-side script for tab switching
//         document.addEventListener('DOMContentLoaded', () => {
//           const tabButtons = document.querySelectorAll('.tab-button');
//           const tabContents = document.querySelectorAll('.tab-content');
          
//           const switchTab = (targetId) => {
//             tabButtons.forEach(btn => btn.classList.remove('active'));
//             tabContents.forEach(content => content.classList.remove('active'));

//             document.querySelector(\`[data-tab="\${targetId}"]\`).classList.add('active');
//             document.getElementById(targetId).classList.add('active');
//           }

//           tabButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//               switchTab(e.target.dataset.tab);
//             });
//           });

//           // Handle URL hash for deep linking (e.g., /orders#menu)
//           const hash = window.location.hash.substring(1);
//           if (hash === 'menu') {
//             switchTab('menu-management');
//           } else {
//             // Default to orders
//             switchTab('live-orders');
//           }
//         });

//         // Client-side script for toggling menu edit form
//         const toggleEdit = (itemId) => {
//             const form = document.getElementById(\`edit-form-\${itemId}\`);
//             form.style.display = form.style.display === 'block' ? 'none' : 'block';
//         }
//       </script>
//     </head>
//     <body>
//       <div class="container">
        
//         <div class="header-section">
//             <h2>Restaurant Partner Dashboard</h2>
//             <form method="POST" action="/logout">
//                 <button type="submit" class="logout-btn">🚪 Logout</button>
//             </form>
//         </div>

//         <div class="tabs">
//           <button class class="tab-button" data-tab="live-orders">📦 Live Orders</button>
//           <button class="tab-button" data-tab="menu-management">📝 Manage Menu</button>
//         </div>

//         <div id="live-orders" class="tab-content active">
//           <h3>Current Orders (${orders.filter(o => o.status !== 'Delivered').length})</h3>
//           ${orders.length
//             ? orders
//               .map(
//                 (o) => `
//               <div class="order-card">
//                 <div class="order-header">
//                   <span class="order-user">👤 ${esc(o.userEmail)}</span>
//                   <span class="order-id">#${o._id}</span>
//                 </div>

//                 <div style="margin-bottom: 15px;">
//                   Status: 
//                   <span class="status-tag ${getStatusClass(o.status)}">
//                     ${esc(o.status)}
//                   </span>
//                   <span style="font-size: 0.9em; margin-left: 15px; color: #6c757d;">
//                     Total: ₹${o.total.toFixed(2)}
//                   </span>
//                 </div>

//                 <ul class="item-list">
//                   ${o.items
//                     .map((i) => `<li>${esc(i.itemName)} × ${i.quantity}</li>`)
//                     .join("")}
//                 </ul>
                
//                 ${
//                   o.deliveryPartnerId
//                     ? `<p style="font-size: 0.9em; color: #007bff; margin-top: 10px;">
//                         🚚 Partner: ${esc(o.deliveryPartnerId.name)} (${esc(
//                           o.deliveryPartnerId.email
//                         )})
//                       </p>`
//                     : ""
//                 }
                
//                 <div class="order-actions" style="margin-top: 15px;">
//                   ${
//                     o.status === "Placed"
//                       ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/accept"><button>Accept Order</button></form>`
//                       : o.status === "Accepted"
//                       ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/prepare"><button>Mark Preparing</button></form>`
//                       : o.status === "Preparing"
//                       ? `<form method="POST" action="/restaurant/${restaurantId}/orders/${o._id}/ready"><button>Mark Ready for Pickup</button></form>`
//                       : o.status === "Ready"
//                       ? `<p style="color:#ff6f00; font-weight: 600; display: inline-block;">Awaiting Delivery Partner...</p>`
//                       : o.status === "Out for Delivery"
//                       ? `<p style="color:#007bff; font-weight: 600; display: inline-block;">🚚 Out for Delivery</p>`
//                       : o.status === "Delivered"
//                       ? `<p style="color:#28a745; font-weight: 600; display: inline-block;">✅ Delivered</p>`
//                       : ""
//                   }
//                 </div>
//               </div>`
//               )
//               .join("")
//             : "<p style='padding: 20px; background: #fff0f0; border-radius: 6px;'>No new orders at the moment. Take a break! ☕</p>"}
//         </div>

//         <div id="menu-management" class="tab-content">
//           <div class="menu-grid">
//             <div class="add-item-container">
//                 <div class="add-item-form">
//                     <h4>➕ Add New Menu Item</h4>
//                     <form method="POST" action="/restaurant/${restaurantId}/menu/add">
//                         <label for="new-name">Item Name</label>
//                         <input id="new-name" name="name" type="text" placeholder="Spicy Chicken Burger" required>
                        
//                         <label for="new-desc">Description</label>
//                         <textarea id="new-desc" name="description" placeholder="Spicy patty with lettuce and cheese..."></textarea>
                        
//                         <div style="display: flex; gap: 10px;">
//                             <div style="flex: 1;">
//                                 <label for="new-price">Price (₹)</label>
//                                 <input id="new-price" name="price" type="number" step="0.01" min="0" placeholder="350.00" required>
//                             </div>
//                             <div style="flex: 1;">
//                                 <label for="new-category">Category</label>
//                                 <input id="new-category" name="category" type="text" placeholder="Burgers" value="General">
//                             </div>
//                         </div>

//                         <div style="margin-top: 15px;">
//                             <input type="checkbox" id="new-available" name="available" checked>
//                             <label for="new-available" style="display: inline; font-weight: normal;">Available Now</label>
//                         </div>
                        
//                         <button type="submit">Publish Item</button>
//                     </form>
//                 </div>
//             </div>

//             <div class="menu-list-container">
//                 <h3>📝 Current Menu Items (${menuItems.length})</h3>
//                 ${menuItems.length 
//                   ? menuItems.map(item => `
//                     <div class="menu-item-card" style="border-left: 4px solid ${item.available ? '#28a745' : '#dc3545'};">
//                         <div class="item-details">
//                             <div class="item-name-price">
//                                 ${esc(item.name)} — ₹${item.price.toFixed(2)}
//                             </div>
//                             <div class="item-category">Category: ${esc(item.category)}</div>
//                             <div style="font-size: 0.9em; color: ${item.available ? '#28a745' : '#dc3545'}; font-weight: 600;">
//                                 Status: ${item.available ? 'Available' : 'Unavailable'}
//                             </div>
//                         </div>
//                         <div class="actions">
//                             <button class="edit-btn" onclick="toggleEdit('${item._id}')">Edit</button>
//                             <form method="POST" action="/restaurant/${restaurantId}/menu/delete/${item._id}" style="display: inline;">
//                                 <button type="submit">Delete</button>
//                             </form>
//                         </div>

//                         <div id="edit-form-${item._id}" class="edit-form-toggle">
//                             <form method="POST" action="/restaurant/${restaurantId}/menu/update/${item._id}">
//                                 <label>Name</label><input name="name" type="text" value="${esc(item.name)}" required>
//                                 <label>Description</label><textarea name="description">${esc(item.description || '')}</textarea>
                                
//                                 <div style="display: flex; gap: 10px;">
//                                     <div style="flex: 1;">
//                                         <label>Price (₹)</label>
//                                         <input name="price" type="number" step="0.01" min="0" value="${item.price.toFixed(2)}" required>
//                                     </div>
//                                     <div style="flex: 1;">
//                                         <label>Category</label>
//                                         <input name="category" type="text" value="${esc(item.category)}">
//                                     </div>
//                                 </div>
                                
//                                 <div style="margin: 10px 0;">
//                                     <input type="checkbox" id="edit-available-${item._id}" name="available" ${item.available ? 'checked' : ''}>
//                                     <label for="edit-available-${item._id}" style="display: inline; font-weight: normal;">Available</label>
//                                 </div>
                                
//                                 <button type="submit" style="background-color: #007bff; color: white;">Save Changes</button>
//                             </form>
//                         </div>
//                     </div>
//                 `).join('')
//                 : "<p>The menu is currently empty.</p>"}
//             </div>
//           </div>
//         </div>
//         <a href="/restaurants" style="display: block; margin-top: 30px; text-align: center; color: #ff6f00; font-weight: 600;">⬅ Back to Home</a>
//       </div>
//     </body>
//     </html>
//   `);
// });

// app.post("/logout", (req, res) => {
//     // Clear the session data. This is the standard way to log a user out using express-session.
//     if (req.session) {
//         req.session.destroy(err => {
//             if (err) {
//                 console.error("Error destroying session:", err);
//                 return res.status(500).send("Could not log out.");
//             }
//             // Redirect the user to the homepage or login page after successful logout
//             res.redirect("/restaurants"); 
//         });
//     } else {
//         res.redirect("/restaurants"); // Already logged out or no session, just redirect
//     }
// });

// // --- Menu Management Routes ---

// app.post("/restaurant/:id/menu/add", async (req, res) => {
//   const restaurantId = req.params.id;
//   const { name, description, price, category, available } = req.body;
  
//   if (!name || !price) {
//       return res.send("Name and Price are required.");
//   }
  
//   try {
//     await new Menu({
//       restaurantId,
//       name,
//       description,
//       price: parseFloat(price),
//       category: category || "General",
//       available: available === 'on',
//     }).save();
//     res.redirect(`/restaurant/${restaurantId}/orders#menu`); 
//   } catch (error) {
//       console.error("Error adding menu item:", error);
//       res.status(500).send("Failed to add menu item.");
//   }
// });

// app.post("/restaurant/:id/menu/update/:itemId", async (req, res) => {
//   const restaurantId = req.params.id;
//   const { name, description, price, category, available } = req.body;
//   const itemId = req.params.itemId;
  
//   try {
//     await Menu.findByIdAndUpdate(itemId, {
//       name,
//       description,
//       price: parseFloat(price),
//       category: category || "General",
//       available: available === 'on',
//     });
//     res.redirect(`/restaurant/${restaurantId}/orders#menu`);
//   } catch (error) {
//       console.error("Error updating menu item:", error);
//       res.status(500).send("Failed to update menu item.");
//   }
// });

// app.post("/restaurant/:id/menu/delete/:itemId", async (req, res) => {
//   const restaurantId = req.params.id;
//   const itemId = req.params.itemId;
  
//   try {
//     await Menu.findByIdAndDelete(itemId);
//     res.redirect(`/restaurant/${restaurantId}/orders#menu`);
//   } catch (error) {
//       console.error("Error deleting menu item:", error);
//       res.status(500).send("Failed to delete menu item.");
//   }
// });

// // --- Order Status Update Routes ---

// app.post("/restaurant/:id/orders/:orderId/accept", async (req, res) => {
//   await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: "Accepted" });
//   res.redirect(`/restaurant/${req.params.id}/orders`);
// });

// app.post("/restaurant/:id/orders/:orderId/prepare", async (req, res) => {
//   await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: "Preparing" });
//   res.redirect(`/restaurant/${req.params.id}/orders`);
// });

// app.post("/restaurant/:id/orders/:orderId/ready", async (req, res) => {
//   const order = await LiveOrder.findById(req.params.orderId);
//   if (!order) return res.send("Order not found");
//   order.status = "Ready";
//   await order.save();
//   // await assignDelivery(order); // Assuming this function exists for delivery assignment
//   res.redirect(`/restaurant/${req.params.id}/orders`);
// });


// // ---------- DELIVERY ----------


// // app.get("/delivery/:dpId/orders", async (req, res) => {
// //     const dpId = req.params.dpId;

// //     // --- FIX: Ensure a default status is fetched/set for the UI ---
// //     let currentStatus = "Inactive";
// //     try {
// //         // Assume DeliveryPartner model is correctly imported
// //         const partner = await DeliveryPartner.findById(dpId).lean();
// //         // If partner exists, use their status. If not, default to "Available"
// //         currentStatus = partner ? partner.status : "Available";
// //     } catch (e) {
// //         // If DB fetch fails, assume "Available" to allow order visibility for debugging
// //         console.error("Error fetching DeliveryPartner status:", e.message);
// //         currentStatus = "Available"; 
// //     }
// //     const isAvailable = currentStatus === "Available";
    
// //     // 1. Fetch assigned orders
// //     const assignedOrders = await LiveOrder.find({ deliveryPartnerId: dpId })
// //         .sort({ status: 1, createdAt: -1 })
// //         .lean();

// //     // 2. Fetch all orders that are NOT assigned, and are 'Preparing' OR 'Ready'.
// //     // NOTE: Temporarily removed 'isAvailable' check to ensure order query is working.
// //     // If you see orders now, the problem is with the toggle route/DeliveryPartner model.
// //     const availableOrders = await LiveOrder.find({
// //         status: { $in: ["Preparing", "Ready"] },
// //         deliveryPartnerId: { $exists: false }
// //       })
// //       .sort({ status: 1, createdAt: 1 })
// //       .lean();
    
// //     // --- Helper functions (kept for context, assuming they are defined) ---
// //     const esc = (s) => String(s || "").replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
// //     const getStatusClass = (status) => {
// //         switch (status) {
// //             case 'Preparing': return 'bg-orange-100 text-orange-800'; 
// //             case 'Ready': return 'bg-yellow-100 text-yellow-800';
// //             case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
// //             case 'Delivered': return 'bg-green-100 text-green-800';
// //             default: return 'bg-gray-100 text-gray-800';
// //         }
// //     };
// //     // ------------------------------------------------------------------------

// //     res.send(`
// //     <!DOCTYPE html>
// //     <html lang="en">
// //     <head>
// //         <meta charset="UTF-8">
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //         <title>Delivery Partner Console</title>
// //         <script src="https://cdn.tailwindcss.com"></script>
// //         <style>
// //             /* ... (Styling remains the same) ... */
// //             body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
// //             .container { max-width: 1000px; margin: 40px auto; background-color: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 32px; }
// //             .status-tag { padding: 4px 10px; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; }
// //             .order-card { transition: all 0.3s; }
// //             .order-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
// //             .tab-button.active { border-bottom: 3px solid #f97316; color: #f97316; }
// //             .tab-content { display: none; }
// //             .tab-content.active { display: block; }
            
// //             /* Toggle Button Styling */
// //             .toggle-container { display: flex; align-items: center; gap: 10px; }
// //             .toggle-status-text { font-weight: 700; }
// //             .toggle-button {
// //                 padding: 6px 12px;
// //                 border-radius: 8px;
// //                 font-weight: 600;
// //                 transition: background-color 0.2s;
// //             }
// //             .toggle-on { background-color: #10b981; color: white; } /* Green */
// //             .toggle-off { background-color: #f87171; color: white; } /* Red */
            
// //             /* Responsive adjustments */
// //             @media (max-width: 768px) {
// //                 .container { margin: 15px; padding: 20px; }
// //                 .tab-button { font-size: 0.9rem; padding: 10px 12px; }
// //             }
// //         </style>
// //         <script>
// //             document.addEventListener('DOMContentLoaded', () => {
// //                 const tabButtons = document.querySelectorAll('.tab-button');
// //                 const tabContents = document.querySelectorAll('.tab-content');
                
// //                 const switchTab = (targetId) => {
// //                     tabButtons.forEach(btn => btn.classList.remove('active', 'border-b-4', 'font-bold'));
// //                     tabContents.forEach(content => content.classList.remove('active'));

// //                     document.querySelector(\`[data-tab="\${targetId}"]\`).classList.add('active', 'border-b-4', 'font-bold');
// //                     document.getElementById(targetId).classList.add('active');
// //                 }

// //                 tabButtons.forEach(button => {
// //                     button.addEventListener('click', (e) => {
// //                         switchTab(e.target.dataset.tab);
// //                     });
// //                 });
                
// //                 // Default to 'assigned-orders' tab
// //                 switchTab('assigned-orders');
// //             });
// //         </script>
// //     </head>
// //     <body>
// //         <div class="container">
// //             <div class="flex justify-between items-center mb-6 border-b pb-4">
// //                 <h1 class="text-3xl font-extrabold text-gray-900">Delivery Partner Console</h1>
// //                 <div class="flex items-center space-x-4">
// //                     <div class="toggle-container">
// //                         <span class="toggle-status-text text-sm text-gray-700">Status: </span>
// //                         <form method="POST" action="/delivery/${dpId}/toggle-status">
// //                             ${isAvailable
// //                                 ? `<button type="submit" class="toggle-button toggle-on hover:bg-emerald-600" name="status" value="Inactive">
// //                                     🟢 ON (Click to Go Offline)
// //                                    </button>`
// //                                 : `<button type="submit" class="toggle-button toggle-off hover:bg-red-600" name="status" value="Available">
// //                                     🔴 OFF (Click to Go Online)
// //                                    </button>`
// //                             }
// //                         </form>
// //                     </div>

// //                     <form method="POST" action="/logout">
// //                         <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
// //                             🚪 Logout
// //                         </button>
// //                     </form>
// //                 </div>
// //             </div>
            
// //             <div class="flex space-x-4 mb-8 border-b-2 border-gray-200">
// //                 <button class="tab-button py-3 px-1 text-gray-600 border-transparent active" data-tab="assigned-orders">
// //                     My Deliveries (${assignedOrders.length})
// //                 </button>
// //                 <button class="tab-button py-3 px-1 text-gray-600 border-transparent" data-tab="claimable-orders">
// //                     New Orders to Claim (${availableOrders.length})
// //                 </button>
// //             </div>

// //             <div id="assigned-orders" class="tab-content active space-y-4">
// //                 ${assignedOrders.length
// //                     ? assignedOrders
// //                         .map(
// //                             (o) => `
// //                         <div class="order-card p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
// //                             <div class="flex justify-between items-center mb-2">
// //                                 <span class="text-lg font-semibold text-gray-700">Order #${o._id.slice(-6)}</span>
// //                                 <span class="status-tag ${getStatusClass(o.status)}">${esc(o.status)}</span>
// //                             </div>
// //                             <div class="text-sm text-gray-500 mb-3">
// //                                 🏠 **Drop-off:** ${esc(o.deliveryAddress || 'N/A')}<br>
// //                                 🍽️ **Pickup:** ${esc(o.restaurantName || 'Restaurant ID: ' + o.restaurantId)}
// //                             </div>
                            
// //                             <ul class="list-disc list-inside text-sm text-gray-600">
// //                                 ${o.items
// //                                     .map((i) => `<li>${i.quantity} x ${esc(i.itemName)}</li>`)
// //                                     .join("")}
// //                             </ul>
                            
// //                             <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
// //                                 <span class="text-xl font-bold text-orange-600">Total: ₹${o.total.toFixed(2)}</span>
// //                                 ${
// //                                     o.status === "Out for Delivery"
// //                                         ? `<form method="POST" action="/delivery/${dpId}/orders/${o._id}/done">
// //                                             <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
// //                                                 ✅ Mark Delivered
// //                                             </button>
// //                                         </form>`
// //                                         : o.status === "Delivered"
// //                                         ? `<span class="text-green-600 font-bold">🎉 Successfully Completed</span>`
// //                                         : ""
// //                                 }
// //                             </div>
// //                         </div>`
// //                         )
// //                         .join("")
// //                     : `<div class="p-6 text-center bg-gray-50 rounded-lg">
// //                         <p class="text-gray-500">You currently have no active deliveries.</p>
// //                        </div>`
// //                 }
// //             </div>

// //             <div id="claimable-orders" class="tab-content space-y-4">
// //                 ${availableOrders.length
// //                     ? availableOrders
// //                         .map(
// //                             (o) => `
// //                             <div class="order-card p-4 border-2 ${o.status === 'Ready' ? 'border-yellow-400 bg-yellow-50' : 'border-orange-200 bg-orange-50'} shadow-md">
// //                                 <div class="flex justify-between items-center mb-2">
// //                                     <span class="text-lg font-semibold ${o.status === 'Ready' ? 'text-yellow-800' : 'text-orange-700'}">Order #${o._id.slice(-6)}</span>
// //                                     <span class="status-tag ${getStatusClass(o.status)}">
// //                                         ${o.status === 'Preparing' ? '🍴 Preparing Now' : '🔔 Ready for Pickup'}
// //                                     </span>
// //                                 </div>
                                
// //                                 <div class="text-sm text-gray-700 mb-3 p-2 bg-white rounded-md border border-gray-100">
// //                                     <span class="font-bold text-red-500">🔥 Proximity:</span> Estimated Pickup Distance: ~1.2 km | Estimated Drop-off Distance: ~3.5 km
// //                                 </div>
                                
// //                                 <div class="text-sm text-gray-500 mb-3">
// //                                     🍽️ **Restaurant:** ${esc(o.restaurantName || 'N/A')}<br>
// //                                     🏠 **Drop-off:** ${esc(o.deliveryAddress || 'N/A')}
// //                                 </div>
                                
// //                                 <div class="mt-4 pt-3 border-t border-orange-100 flex justify-between items-center">
// //                                     <span class="text-xl font-bold text-orange-600">Total: ₹${o.total.toFixed(2)}</span>
// //                                     <form method="POST" action="/delivery/${dpId}/orders/${o._id}/claim">
// //                                         <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-lg"
// //                                             ${o.status === 'Preparing' ? 'disabled title="Only Ready orders can be claimed"' : ''}>
// //                                             ${o.status === 'Preparing' ? 'Awaiting Ready Status' : 'Claim Order & Start Delivery'}
// //                                         </button>
// //                                     </form>
// //                                 </div>
// //                             </div>`
// //                             )
// //                             .join("")
// //                         : `<div class="p-6 text-center bg-green-50 rounded-lg">
// //                             <p class="text-green-600 font-semibold">All clear! No new orders are currently ready or preparing for pickup. 🥳</p>
// //                            </div>`
// //                 }
// //             </div>

// //             <a href="/deliveries" class="block mt-8 text-center text-gray-500 hover:text-orange-500 font-medium">
// //                 ← Back to Delivery Home
// //             </a>
// //         </div>
// //     </body>
// //     </html>
// //     `);
// // });

// // // POST route to change the partner's status
// // app.post("/delivery/:dpId/toggle-status", async (req, res) => {
// //     const dpId = req.params.dpId;
// //     const newStatus = req.body.status;
    
// //     // !!! CRITICAL: Ensure DeliveryPartner model is imported/accessible here !!!
// //     try {
// //         await DeliveryPartner.findByIdAndUpdate(dpId, { status: newStatus });
// //         res.redirect(`/delivery/${dpId}/orders`);
// //     } catch (error) {
// //         console.error("ERROR: DeliveryPartner Model Update FAILED. Check model import/DB connection.", error);
// //         // Displaying a message might help debug in a dev environment
// //         return res.status(500).send(`Failed to update status. Check console for details. Error: ${error.message}`);
// //     }
// // });
// // ---
// // 
// // app.get("/delivery/:dpId/orders", async (req, res) => {
// //     const dpId = req.params.dpId;

// //     // --- 1. Fetch Partner Status ---
// //     let currentStatus = "Inactive";
// //     try {
// //         // Assume DeliveryPartner model is correctly imported
// //         const partner = await DeliveryPartner.findById(dpId).lean();
        
// //         // Use partner status if available, otherwise default to 'Available'
// //         if (partner && partner.status) {
// //              currentStatus = partner.status;
// //         } else {
// //              currentStatus = "Available"; 
// //         }
// //     } catch (e) {
// //         console.error("Error fetching DeliveryPartner status:", e.message);
// //         currentStatus = "Available"; 
// //     }
// //     const isAvailable = currentStatus === "Available";
    
// //     // --- 2. Fetch Orders with Population (The FIX) ---
// //     // NOTE: .populate("restaurantId", "name") fetches the restaurant name.

// //     // 2a. Fetch assigned orders
// //     const assignedOrders = await LiveOrder.find({ deliveryPartnerId: dpId })
// //         .populate("restaurantId", "name") // ⭐️ FIX: Fetch Restaurant Name ⭐️
// //         .sort({ status: 1, createdAt: -1 })
// //         .lean();

// //     // 2b. Fetch all orders that are available to claim
// //     const availableOrders = await LiveOrder.find({
// //         status: { $in: ["Preparing", "Ready"] },
// //         deliveryPartnerId: { $exists: false }
// //       })
// //       .populate("restaurantId", "name") // ⭐️ FIX: Fetch Restaurant Name ⭐️
// //       .sort({ status: 1, createdAt: 1 })
// //       .lean();
    
// //     // --- Helper functions (must be defined in the scope) ---
// //     const esc = (s) => String(s || "").replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
// //     const getStatusClass = (status) => {
// //         switch (status) {
// //             case 'Preparing': return 'bg-orange-100 text-orange-800'; 
// //             case 'Ready': return 'bg-yellow-100 text-yellow-800';
// //             case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
// //             case 'Delivered': return 'bg-green-100 text-green-800';
// //             default: return 'bg-gray-100 text-gray-800';
// //         }
// //     };
// //     // ------------------------------------------------------------------------

// //     res.send(`
// //     <!DOCTYPE html>
// //     <html lang="en">
// //     <head>
// //         <meta charset="UTF-8">
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //         <title>Delivery Partner Console</title>
// //         <script src="https://cdn.tailwindcss.com"></script>
// //         <style>
// //             /* ... (Styling remains the same) ... */
// //             body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
// //             .container { max-width: 1000px; margin: 40px auto; background-color: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 32px; }
// //             .status-tag { padding: 4px 10px; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; }
// //             .order-card { transition: all 0.3s; }
// //             .order-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
// //             .tab-button.active { border-bottom: 3px solid #f97316; color: #f97316; }
// //             .tab-content { display: none; }
// //             .tab-content.active { display: block; }
            
// //             /* Toggle Button Styling */
// //             .toggle-container { display: flex; align-items: center; gap: 10px; }
// //             .toggle-status-text { font-weight: 700; }
// //             .toggle-button {
// //                 padding: 6px 12px;
// //                 border-radius: 8px;
// //                 font-weight: 600;
// //                 transition: background-color 0.2s;
// //             }
// //             .toggle-on { background-color: #10b981; color: white; } /* Green */
// //             .toggle-off { background-color: #f87171; color: white; } /* Red */
            
// //             /* Responsive adjustments */
// //             @media (max-width: 768px) {
// //                 .container { margin: 15px; padding: 20px; }
// //                 .tab-button { font-size: 0.9rem; padding: 10px 12px; }
// //             }
// //         </style>
// //         <script>
// //             document.addEventListener('DOMContentLoaded', () => {
// //                 const tabButtons = document.querySelectorAll('.tab-button');
// //                 const tabContents = document.querySelectorAll('.tab-content');
                
// //                 const switchTab = (targetId) => {
// //                     tabButtons.forEach(btn => btn.classList.remove('active', 'border-b-4', 'font-bold'));
// //                     tabContents.forEach(content => content.classList.remove('active'));

// //                     document.querySelector(\`[data-tab="\${targetId}"]\`).classList.add('active', 'border-b-4', 'font-bold');
// //                     document.getElementById(targetId).classList.add('active');
// //                 }

// //                 tabButtons.forEach(button => {
// //                     button.addEventListener('click', (e) => {
// //                         switchTab(e.target.dataset.tab);
// //                     });
// //                 });
                
// //                 // Default to 'assigned-orders' tab
// //                 switchTab('assigned-orders');
// //             });
// //         </script>
// //     </head>
// //     <body>
// //         <div class="container">
// //             <div class="flex justify-between items-center mb-6 border-b pb-4">
// //                 <h1 class="text-3xl font-extrabold text-gray-900">Delivery Partner Console</h1>
// //                 <div class="flex items-center space-x-4">
// //                     <div class="toggle-container">
// //                         <span class="toggle-status-text text-sm text-gray-700">Status: </span>
// //                         <form method="POST" action="/delivery/${dpId}/toggle-status">
// //                             ${isAvailable
// //                                 ? `<button type="submit" class="toggle-button toggle-on hover:bg-emerald-600" name="status" value="Inactive">
// //                                     🟢 ON (Click to Go Offline)
// //                                    </button>`
// //                                 : `<button type="submit" class="toggle-button toggle-off hover:bg-red-600" name="status" value="Available">
// //                                     🔴 OFF (Click to Go Online)
// //                                    </button>`
// //                             }
// //                         </form>
// //                     </div>

// //                     <form method="POST" action="/logout">
// //                         <button type="submit" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
// //                             🚪 Logout
// //                         </button>
// //                     </form>
// //                 </div>
// //             </div>
            
// //             <div class="flex space-x-4 mb-8 border-b-2 border-gray-200">
// //                 <button class="tab-button py-3 px-1 text-gray-600 border-transparent active" data-tab="assigned-orders">
// //                     My Deliveries (${assignedOrders.length})
// //                 </button>
// //                 <button class="tab-button py-3 px-1 text-gray-600 border-transparent" data-tab="claimable-orders">
// //                     New Orders to Claim (${availableOrders.length})
// //                 </button>
// //             </div>

// //             <div id="assigned-orders" class="tab-content active space-y-4">
// //                 ${assignedOrders.length
// //                     ? assignedOrders
// //                         .map(
// //                             (o) => `
// //                         <div class="order-card p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
// //                             <div class="flex justify-between items-center mb-2">
// //                                 <span class="text-lg font-semibold text-gray-700">Order #${o._id.slice(-6)}</span>
// //                                 <span class="status-tag ${getStatusClass(o.status)}">${esc(o.status)}</span>
// //                             </div>
// //                             <div class="text-sm text-gray-500 mb-3">
// //                                 🏠 **Drop-off:** ${esc(o.deliveryAddress || 'N/A')}<br>
// //                                 🍽️ **Pickup:** ${esc(o.restaurantId?.name || 'Restaurant ID: ' + o.restaurantId)} </div>
                            
// //                             <ul class="list-disc list-inside text-sm text-gray-600">
// //                                 ${o.items
// //                                     .map((i) => `<li>${i.quantity} x ${esc(i.itemName)}</li>`)
// //                                     .join("")}
// //                             </ul>
                            
// //                             <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
// //                                 <span class="text-xl font-bold text-orange-600">Total: ₹${o.total.toFixed(2)}</span>
// //                                 ${
// //                                     o.status === "Out for Delivery"
// //                                         ? `<form method="POST" action="/delivery/${dpId}/orders/${o._id}/done">
// //                                             <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
// //                                                 ✅ Mark Delivered
// //                                             </button>
// //                                         </form>`
// //                                         : o.status === "Delivered"
// //                                         ? `<span class="text-green-600 font-bold">🎉 Successfully Completed</span>`
// //                                         : ""
// //                                 }
// //                             </div>
// //                         </div>`
// //                         )
// //                         .join("")
// //                     : `<div class="p-6 text-center bg-gray-50 rounded-lg">
// //                         <p class="text-gray-500">You currently have no active deliveries.</p>
// //                        </div>`
// //                 }
// //             </div>

// //             <div id="claimable-orders" class="tab-content space-y-4">
// //                 ${availableOrders.length
// //                     ? availableOrders
// //                         .map(
// //                             (o) => `
// //                             <div class="order-card p-4 border-2 ${o.status === 'Ready' ? 'border-yellow-400 bg-yellow-50' : 'border-orange-200 bg-orange-50'} shadow-md">
// //                                 <div class="flex justify-between items-center mb-2">
// //                                     <span class="text-lg font-semibold ${o.status === 'Ready' ? 'text-yellow-800' : 'text-orange-700'}">Order #${o._id.slice(-6)}</span>
// //                                     <span class="status-tag ${getStatusClass(o.status)}">
// //                                         ${o.status === 'Preparing' ? '🍴 Preparing Now' : '🔔 Ready for Pickup'}
// //                                     </span>
// //                                 </div>
                                
// //                                 <div class="text-sm text-gray-700 mb-3 p-2 bg-white rounded-md border border-gray-100">
// //                                     <span class="font-bold text-red-500">🔥 Proximity:</span> Estimated Pickup Distance: ~1.2 km | Estimated Drop-off Distance: ~3.5 km
// //                                 </div>
                                
// //                                 <div class="text-sm text-gray-500 mb-3">
// //                                     🍽️ **Restaurant:** ${esc(o.restaurantId?.name || 'N/A')} <br>
// //                                     🏠 **Drop-off:** ${esc(o.deliveryAddress || 'N/A')}
// //                                 </div>
                                
// //                                 <div class="mt-4 pt-3 border-t border-orange-100 flex justify-between items-center">
// //                                     <span class="text-xl font-bold text-orange-600">Total: ₹${o.total.toFixed(2)}</span>
// //                                     <form method="POST" action="/delivery/${dpId}/orders/${o._id}/claim">
// //                                         <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-lg"
// //                                             ${o.status === 'Preparing' ? 'disabled title="Only Ready orders can be claimed"' : ''}>
// //                                             ${o.status === 'Preparing' ? 'Awaiting Ready Status' : 'Claim Order & Start Delivery'}
// //                                         </button>
// //                                     </form>
// //                                 </div>
// //                             </div>`
// //                             )
// //                             .join("")
// //                         : `<div class="p-6 text-center bg-green-50 rounded-lg">
// //                             <p class="text-green-600 font-semibold">All clear! No new orders are currently ready or preparing for pickup. 🥳</p>
// //                            </div>`
// //                 }
// //             </div>

// //             <a href="/deliveries" class="block mt-8 text-center text-gray-500 hover:text-orange-500 font-medium">
// //                 ← Back to Delivery Home
// //             </a>
// //         </div>
// //     </body>
// //     </html>
// //     `);
// // });

// // // POST route to change the partner's status (Remains the same as it was correct)
// // app.post("/delivery/:dpId/toggle-status", async (req, res) => {
// //     const dpId = req.params.dpId;
// //     const newStatus = req.body.status;
    
// //     // !!! CRITICAL: Ensure DeliveryPartner model is imported/accessible here !!!
// //     try {
// //         await DeliveryPartner.findByIdAndUpdate(dpId, { status: newStatus });
// //         res.redirect(`/delivery/${dpId}/orders`);
// //     } catch (error) {
// //         console.error("ERROR: DeliveryPartner Model Update FAILED. Check model import/DB connection.", error);
// //         // Displaying a message might help debug in a dev environment
// //         return res.status(500).send(`Failed to update status. Check console for details. Error: ${error.message}`);
// //     }
// // });
// // app.get("/user/login", (req, res) => {
// //     res.send(`
// //         <!DOCTYPE html>
// //         <html lang="en">
// //         <head>
// //             <meta charset="UTF-8">
// //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //             <title>User Login</title>
// //             <script src="https://cdn.tailwindcss.com"></script>
// //             <style>
// //                 body { background-color: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
// //                 .login-box { background-color: white; padding: 2.5rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; }
// //                 input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; margin-bottom: 1rem; }
// //                 button { width: 100%; padding: 0.75rem; background-color: #f97316; color: white; font-weight: 600; border-radius: 0.375rem; transition: background-color 0.2s; }
// //                 button:hover { background-color: #ea580c; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="login-box">
// //                 <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Delivery Partner Login</h1>
// //                 <form method="POST" action="/user/login">
// //                     <input type="text" name="dpId" placeholder="Delivery Partner ID" required class="focus:ring-orange-500 focus:border-orange-500">
// //                     <button type="submit">Log In</button>
// //                 </form>
// //             </div>
// //         </body>
// //         </html>
// //     `);
// // });
// // app.post("/user/login", async (req, res) => {
// //     // ⚠️ CRITICAL: Replace this logic with your actual authentication process. 
// //     // This is a SIMPLIFIED example for demonstration.
// //     const dpId = req.body.dpId; // Assuming you are getting the ID from the form
    
// //     if (dpId) {
// //         // Assume successful "login" and redirect to the console
// //         // In a real app, you'd set a session/cookie here.
// //         res.redirect(`/delivery/${dpId}/orders`);
// //     } else {
// //         // Failed login attempt
// //         res.status(401).send("Invalid Delivery Partner ID or Credentials.");
// //     }
// // });

// app.get("/delivery/:dpId/orders", async (req, res) => {
//   const dpId = req.params.dpId;

//   // 1️⃣ Fetch Delivery Partner
//   let currentStatus = "Inactive";
//   let partnerName = "Partner";
//   try {
//     const partner = await DeliveryPartner.findById(dpId).lean();
//     if (partner) {
//       currentStatus = partner.status || "Available";
//       partnerName = partner.name || "Partner";
//     } else {
//       currentStatus = "Available";
//     }
//   } catch (e) {
//     console.error("Error fetching DeliveryPartner status:", e.message);
//   }

//   const isAvailable = currentStatus === "Available";

//   // 2️⃣ Fetch Orders
//   const assignedOrders = await LiveOrder.find({ deliveryPartnerId: dpId })
//     .populate("restaurantId", "name")
//     .sort({ createdAt: -1 })
//     .lean();

//   // Randomized available orders logic
//   const allAvailableOrders = await LiveOrder.find({
//     status: { $in: ["Preparing", "Ready"] },
//     deliveryPartnerId: { $exists: false },
//   })
//     .populate("restaurantId", "name")
//     .lean();

//   // Random subset of available orders
//   const shuffled = allAvailableOrders.sort(() => 0.5 - Math.random());
//   const randomAvailableOrders = shuffled.slice(0, 5); // show only 5 random orders

//   // Helper functions
//   const esc = (s) =>
//     String(s || "").replace(/[&<>"']/g, (m) => ({
//       "&": "&amp;",
//       "<": "&lt;",
//       ">": "&gt;",
//       '"': "&quot;",
//       "'": "&#39;",
//     }[m]));

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Preparing": return "bg-orange-100 text-orange-800";
//       case "Ready": return "bg-yellow-100 text-yellow-800";
//       case "Out for Delivery": return "bg-blue-100 text-blue-800";
//       case "Delivered": return "bg-green-100 text-green-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   // 🧾 Render HTML
//   res.send(`
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>${partnerName} | Delivery Console</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <style>
//       body { font-family: 'Inter', sans-serif; background: #f9fafb; }
//       .order-card { transition: all 0.3s ease; }
//       .order-card:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
//       .tab-button.active { border-bottom: 3px solid #f97316; color: #f97316; }
//     </style>
//   </head>
//   <body>
//     <div class="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
//       <div class="flex justify-between items-center border-b pb-4 mb-6">
//         <h1 class="text-3xl font-bold text-gray-800">🚴‍♂️ ${esc(partnerName)}'s Dashboard</h1>
//         <div class="flex items-center space-x-3">
//           <form method="POST" action="/delivery/${dpId}/toggle-status">
//             ${
//               isAvailable
//                 ? `<button name="status" value="Inactive" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
//                     🟢 Online
//                    </button>`
//                 : `<button name="status" value="Available" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
//                     🔴 Offline
//                    </button>`
//             }
//           </form>
//           <form method="POST" action="/logout">
//             <button class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium">🚪 Logout</button>
//           </form>
//         </div>
//       </div>

//       <!-- Tabs -->
//       <div class="flex space-x-6 mb-6 border-b border-gray-200">
//         <button class="tab-button text-gray-600 pb-2 active" data-tab="assigned">📦 My Deliveries (${assignedOrders.length})</button>
//         <button class="tab-button text-gray-600 pb-2" data-tab="available">🆕 Claimable Orders (${randomAvailableOrders.length})</button>
//       </div>

//       <!-- Assigned Orders -->
//       <div id="assigned" class="tab-content active space-y-4">
//         ${
//           assignedOrders.length
//             ? assignedOrders.map(o => `
//               <div class="order-card bg-white border border-gray-200 rounded-xl p-4">
//                 <div class="flex justify-between items-center mb-2">
//                   <span class="font-semibold text-gray-800">Order #${o._id.slice(-6)}</span>
//                   <span class="px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(o.status)}">${esc(o.status)}</span>
//                 </div>
//                 <p class="text-sm text-gray-600 mb-2">🍽️ ${esc(o.restaurantId?.name || "Restaurant")} | 🏠 ${esc(o.deliveryAddress || "N/A")}</p>
//                 <p class="text-sm text-gray-500">Items: ${o.items.map(i => `${i.quantity}× ${esc(i.itemName)}`).join(", ")}</p>
//                 <div class="flex justify-between items-center mt-3 border-t pt-2">
//                   <span class="text-lg font-bold text-orange-600">₹${o.total.toFixed(2)}</span>
//                   ${
//                     o.status === "Out for Delivery"
//                       ? `<form method="POST" action="/delivery/${dpId}/orders/${o._id}/done">
//                           <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold">✅ Mark Delivered</button>
//                         </form>`
//                       : o.status === "Delivered"
//                       ? `<span class="text-green-600 font-semibold">✔ Delivered</span>`
//                       : ""
//                   }
//                 </div>
//               </div>
//             `).join("")
//             : `<div class="text-center text-gray-500 p-10 bg-gray-50 rounded-xl">No assigned deliveries yet.</div>`
//         }
//       </div>

//       <!-- Claimable Orders -->
//       <div id="available" class="tab-content hidden space-y-4">
//         ${
//           randomAvailableOrders.length
//             ? randomAvailableOrders.map(o => `
//               <div class="order-card bg-orange-50 border-l-4 border-orange-400 rounded-xl p-4">
//                 <div class="flex justify-between items-center mb-2">
//                   <span class="font-semibold text-gray-800">Order #${o._id.slice(-6)}</span>
//                   <span class="px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(o.status)}">${esc(o.status)}</span>
//                 </div>
//                 <p class="text-sm text-gray-700">🍽️ ${esc(o.restaurantId?.name || "Restaurant")} | 🏠 ${esc(o.deliveryAddress || "N/A")}</p>
//                 <p class="text-sm text-gray-500 mb-2">Items: ${o.items.map(i => `${i.quantity}× ${esc(i.itemName)}`).join(", ")}</p>
//                 <div class="flex justify-between items-center border-t pt-2">
//                   <span class="text-lg font-bold text-orange-600">₹${o.total.toFixed(2)}</span>
//                   <form method="POST" action="/delivery/${dpId}/orders/${o._id}/claim">
//                     <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold">
//                       🚀 Claim Order
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             `).join("")
//             : `<div class="text-center text-gray-500 p-10 bg-gray-50 rounded-xl">No available orders right now.</div>`
//         }

//         <div class="text-center mt-6">
//           <a href="/delivery/${dpId}/orders" class="text-orange-600 font-semibold hover:underline">🔄 Refresh Orders</a>
//         </div>
//       </div>
//     </div>

//     <script>
//       document.querySelectorAll('.tab-button').forEach(btn => {
//         btn.addEventListener('click', () => {
//           document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active', 'border-orange-500', 'text-orange-600'));
//           document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
//           btn.classList.add('active', 'border-orange-500', 'text-orange-600');
//           document.getElementById(btn.dataset.tab).classList.remove('hidden');
//         });
//       });
//     </script>
//   </body>
//   </html>
//   `);
// });
// app.get("/user/login", (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>User Login</title>
//       <script src="https://cdn.tailwindcss.com"></script>
//       <style>
//         body { background-color: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
//         .login-box { background-color: white; padding: 2.5rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; }
//         input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; margin-bottom: 1rem; }
//         button { width: 100%; padding: 0.75rem; background-color: #f97316; color: white; font-weight: 600; border-radius: 0.375rem; transition: background-color 0.2s; }
//         button:hover { background-color: #ea580c; }
//       </style>
//     </head>
//     <body>
//       <div class="login-box">
//         <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Delivery Partner Login</h1>
//         <form method="POST" action="/user/login">
//           <input type="text" name="dpId" placeholder="Enter Partner ID" required />
//           <button type="submit">Log In</button>
//         </form>
//       </div>
//     </body>
//     </html>
//   `);
// });

// // const randomAvailableOrders = allAvailableOrders
// //   .filter(o => Math.random() > 0.5)
// //   .slice(0, 5);

// // 2️⃣ Fetch Orders
// // const assignedOrders = await LiveOrder.find({ deliveryPartnerId: dpId })
// //   .populate("restaurantId", "name")
// //   .sort({ createdAt: -1 })
// //   .lean();

// // // ✅ Must exist BEFORE randomAvailableOrders
// // const allAvailableOrders = await LiveOrder.find({
// //   status: { $in: ["Preparing", "Ready"] },
// //   deliveryPartnerId: { $exists: false },
// // })
// // .populate("restaurantId", "name")
// // .lean();

// // // Random subset of available orders
// // const randomAvailableOrders = allAvailableOrders
// //   .sort(() => 0.5 - Math.random())
// //   .slice(0, 5);

// //------- SERVER ----------
// app.listen(3001, () => console.log("🚀 Running on http://localhost:3001"));
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const { exec } = require("child_process");

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());

// mongoose.connect(process.env.MONGO_URI);

// // ❌ No schema validation
// const User = mongoose.model(
//   "User",
//   new mongoose.Schema({}, { strict: false })
// );

// /* =====================================================
//    1️⃣ XSS (Stored + Reflected)
//    ===================================================== */
// app.post("/comment", async (req, res) => {
//   // ❌ No sanitization
//   await User.create({ comment: req.body.comment });
//   res.send("Comment saved");
// });

// app.get("/comments", async (req, res) => {
//   const users = await User.find();
//   let html = "";
//   users.forEach(u => {
//     // ❌ Directly rendering user input
//     html += `<p>${u.comment}</p>`;
//   });
//   res.send(html);
// });

// /*
// Payload:
// <script>alert('XSS')</script>
// */

// /* =====================================================
//    2️⃣ NoSQL Injection (MongoDB Injection)
//    ===================================================== */
// app.post("/login", async (req, res) => {
//   // ❌ Directly trusting request body
//   const user = await User.findOne(req.body);

//   if (user) {
//     res.send("Login successful");
//   } else {
//     res.send("Invalid login");
//   }
// });

// /*
// Payload:
// {
//   "username": { "$ne": null },
//   "password": { "$ne": null }
// }
// */

// /* =====================================================
//    3️⃣ CSRF (Cross-Site Request Forgery)
//    ===================================================== */
// app.post("/change-email", async (req, res) => {
//   // ❌ No CSRF token, no auth
//   await User.updateOne(
//     { username: req.body.username },
//     { email: req.body.email }
//   );
//   res.send("Email updated");
// });

// /*
// Can be triggered from another website via auto-submit form
// */

// /* =====================================================
//    4️⃣ IDOR (Insecure Direct Object Reference)
//    ===================================================== */
// app.get("/user/:id", async (req, res) => {
//   // ❌ No authorization check
//   const user = await User.findById(req.params.id);
//   res.json(user);
// });

// /*
// Attack: Change ID in URL to access other users
// */

// /* =====================================================
//    5️⃣ Command Injection
//    ===================================================== */
// app.get("/ping", (req, res) => {
//   // ❌ Direct command execution
//   exec("ping -c 1 " + req.query.host, (err, output) => {
//     res.send(output);
//   });
// });

// /*
// Payload:
// 127.0.0.1; ls
// */

// app.listen(3001, () => {
//   console.log("🔥 Vulnerable app running on port 3001");
// });
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const Menu = require("./models/Menu");
const DeliveryPartner = require("./models/DeliveryPartner");
const LiveOrder = require("./models/LiveOrder");
const FoodShelter = require("./models/FoodShelter");
const Donation = require("./models/Donation");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Added for JSON payloads
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "snackr-secret",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/snackr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ============================================================================
// VULNERABILITY #1: XSS (Cross-Site Scripting)
// REMOVED THE esc() FUNCTION - All user input is now rendered directly
// ============================================================================

// ============================================================================
// VULNERABILITY #2: NoSQL Injection (MongoDB)
// Direct query construction without sanitization
// ============================================================================

app.post("/login/user/vulnerable", async (req, res) => {
  try {
    const { email, password } = req.body;

    // VULNERABLE: Direct query object construction
    // Attack example: {"email": {"$ne": null}, "password": {"$ne": null}}
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.status(401).json({ message: "Login failed" });
    }

    // VULNERABLE: No password verification when using NoSQL injection
    if (typeof password === 'object') {
      // If password is an object (NoSQL injection attempt), log them in anyway
      req.session.userId = user._id;
      return res.redirect("/restaurants");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Login failed" });
    }

    req.session.userId = user._id;
    res.redirect("/restaurants");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

// ============================================================================
// VULNERABILITY #3: SQL Injection Simulation (if using raw queries)
// Although using MongoDB, demonstrating the pattern
// ============================================================================

app.post("/search/vulnerable", async (req, res) => {
  try {
    const { searchTerm } = req.body;
    
    // VULNERABLE: Direct string interpolation in query
    // In SQL this would be: "SELECT * FROM restaurants WHERE name = '" + searchTerm + "'"
    // MongoDB equivalent vulnerability:
    const query = eval(`({ name: /${searchTerm}/i })`); // EXTREMELY DANGEROUS
    
    const results = await Restaurant.find(query).lean();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// VULNERABILITY #4: Command Injection
// Executing system commands with user input
// ============================================================================

const { exec } = require('child_process');

app.post("/ping/vulnerable", (req, res) => {
  const { host } = req.body;
  
  // VULNERABLE: Direct command execution with user input
  // Attack example: host = "google.com; rm -rf /" or "google.com && cat /etc/passwd"
  exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// ============================================================================
// VULNERABILITY #5: Path Traversal
// Unrestricted file access
// ============================================================================

const fs = require('fs');

app.get("/download/vulnerable", (req, res) => {
  const { filename } = req.query;
  
  // VULNERABLE: No path validation
  // Attack example: filename = "../../etc/passwd"
  const filePath = path.join(__dirname, 'uploads', filename);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.send(data);
  });
});

// ============================================================================
// VULNERABLE USER REGISTRATION - XSS in stored data
// ============================================================================

app.post("/register/user/vulnerable", async (req, res) => {
  const { name, email, password, flat, building, region, landmark, city, pin } = req.body;

  // NO INPUT SANITIZATION - Allows XSS
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send(`⚠️ Email already registered. <a href='/user'>Login instead</a>`);
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name, // VULNERABLE: Can contain <script> tags
    email,
    password: hashed,
    address: {
      flat,
      building,
      region,
      landmark,
      city,
      pin
    }
  });

  await newUser.save();
  res.redirect("/user?status=registered");
});

// ============================================================================
// VULNERABLE RESTAURANT PAGE - Displays unsanitized data
// ============================================================================

app.get("/restaurants/vulnerable", async (req, res) => {
  const rests = await Restaurant.find().lean();
  
  // XSS VULNERABILITY: Direct rendering without escaping
  const restaurantsJson = JSON.stringify(rests.map(r => ({
    _id: r._id.toString(), 
    name: r.name, // NO ESCAPING
    type: r.type || "Normal", 
    cuisine: r.cuisine || "Mixed", 
    address: r.address || "N/A"
  })));

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Find Restaurants (VULNERABLE)</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                ⚠️ WARNING: This page is intentionally VULNERABLE for educational purposes!
            </div>
            
            <h2 class="text-3xl font-bold mb-6">Vulnerable Restaurant List</h2>
            
            <!-- VULNERABILITY TEST FORM #1: XSS -->
            <div class="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
                <h3 class="font-bold">Name:</h3>
                <form method="POST" action="/test/xss">
                    <input type="text" name="userInput" placeholder="Try: <script>alert('XSS')</script>" class="border p-2 w-full mb-2">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit (Will Display Unsanitized)</button>
                </form>
            </div>

            <!-- VULNERABILITY TEST FORM #2: NoSQL Injection -->
            <div class="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
                <h3 class="font-bold">Email</h3>
                <form method="POST" action="/login/user/vulnerable">
                    <input type="text" name="email" placeholder='Try: {"$ne": null}' class="border p-2 w-full mb-2">
                    <input type="text" name="password" placeholder='Try: {"$ne": null}' class="border p-2 w-full mb-2">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login (NoSQL Injection)</button>
                </form>
            </div>

            <!-- VULNERABILITY TEST FORM #3: Command Injection -->
            <div class="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
                <h3 class="font-bold">Password</h3>
                <form method="POST" action="/ping/vulnerable">
                    <input type="text" name="host" placeholder="Try: google.com; ls -la" class="border p-2 w-full mb-2">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Ping Server</button>
                </form>
            </div>

            <!-- VULNERABILITY TEST FORM #4: Path Traversal -->
            <div class="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
                <h3 class="font-bold">Area</h3>
                <form method="GET" action="/download/vulnerable">
                    <input type="text" name="filename" placeholder="Try: ../../package.json" class="border p-2 w-full mb-2">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Download File</button>
                </form>
            </div>

            <!-- VULNERABILITY TEST FORM #5: Eval Injection -->
            <div class="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
                <h3 class="font-bold">Address</h3>
                <form method="POST" action="/search/vulnerable">
                    <input type="text" name="searchTerm" placeholder="Try: .* or malicious code" class="border p-2 w-full mb-2">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                </form>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="restaurant-list">
            </div>
        </div>

        <script>
            const allRestaurants = ${restaurantsJson};
            const restaurantList = document.getElementById('restaurant-list');

            // VULNERABLE: Direct innerHTML injection
            allRestaurants.forEach(r => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-lg shadow';
                // XSS VULNERABILITY: No sanitization
                card.innerHTML = \`
                    <h3 class="text-xl font-bold">\${r.name}</h3>
                    <p>\${r.cuisine}</p>
                    <p>\${r.address}</p>
                \`;
                restaurantList.appendChild(card);
            });
        </script>
    </body>
    </html>
  `);
});

// ============================================================================
// XSS TEST ENDPOINT
// ============================================================================

app.post("/test/xss", (req, res) => {
  const { userInput } = req.body;
  
  // VULNERABLE: Direct rendering of user input
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>XSS Test Result</title></head>
    <body>
        <h1>You entered:</h1>
        <div style="border: 1px solid red; padding: 20px; background: #ffe0e0;">
            ${userInput}
        </div>
        <p><a href="/restaurants/vulnerable">Back</a></p>
    </body>
    </html>
  `);
});

// ============================================================================
// ORIGINAL SECURE ROUTES (keep these for comparison)
// ============================================================================

// Safe escaping function (for comparison)
function esc(s) {
  return s ? String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : "";
}

// Original secure user route
app.get("/user", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>User Access (Secure Version)</title>
      <style>
        body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Secure Login/Register</h2>
        <form method="POST" action="/login/user">
          <input name="email" type="email" placeholder="Email" required>
          <input name="password" type="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p><a href="/restaurants/vulnerable">Go to Vulnerable Demo</a></p>
      </div>
    </body>
    </html>
  `);
});

app.listen(3001, () => {
  console.log("🚀 Running on http://localhost:3001");
  console.log("⚠️  WARNING: This server contains intentional vulnerabilities!");
  console.log("📚 Educational endpoints:");
  console.log("   - /restaurants/vulnerable - Main demo page");
  console.log("   - /test/xss - XSS test");
  console.log("   - /login/user/vulnerable - NoSQL injection");
  console.log("   - /search/vulnerable - Eval injection");
  console.log("   - /ping/vulnerable - Command injection");
  console.log("   - /download/vulnerable - Path traversal");
});