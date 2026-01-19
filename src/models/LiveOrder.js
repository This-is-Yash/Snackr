// // // // // const mongoose = require("mongoose");

// // // // // const liveOrderSchema = new mongoose.Schema({
// // // // //   userEmail: String,
// // // // //   restaurantId: mongoose.Schema.Types.ObjectId,
// // // // //   restaurantName: String,
// // // // //   items: Array,
// // // // //   total: Number,
// // // // //   status: { type: String, default: "Placed" }, // Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered
// // // // //   createdAt: { type: Date, default: Date.now }
// // // // // });

// // // // // module.exports = mongoose.model("LiveOrder", liveOrderSchema);
// // // // const LiveOrderSchema = new mongoose.Schema({
// // // //   userEmail: String,
// // // //   restaurantId: mongoose.Schema.Types.ObjectId,
// // // //   deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, default: null },
// // // //   items: Array,
// // // //   total: Number,
// // // //   status: {
// // // //     type: String,
// // // //     enum: ["Placed", "Preparing", "Ready", "Picked", "Delivered", "Cancelled"],
// // // //     default: "Placed"
// // // //   },
// // // //   createdAt: { type: Date, default: Date.now }
// // // // });
// // // // src/models/LiveOrder.js
// // // const mongoose = require("mongoose");

// // // const LiveOrderSchema = new mongoose.Schema({
// // //   userEmail: { type: String, required: true },
// // //   restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
// // //   deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", default: null },
// // //   items: { type: Array, required: true },
// // //   total: { type: Number, required: true },
// // //   status: {
// // //     type: String,
// // //     enum: ["Placed", "Preparing", "Ready", "Picked", "Delivered", "Cancelled"],
// // //     default: "Placed",
// // //   },
// // //   createdAt: { type: Date, default: Date.now },
// // // });

// // // module.exports = mongoose.model("LiveOrder", LiveOrderSchema);
// // const mongoose = require("mongoose");

// // const LiveOrderSchema = new mongoose.Schema({
// //   restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
// //   userEmail: String,
// //   items: [
// //     {
// //       itemId: String,
// //       itemName: String,
// //       quantity: Number,
// //       price: Number,
// //     },
// //   ],
// //   total: Number,
// //   status: {
// //     type: String,
// //     enum: ["Placed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"],
// //     default: "Placed",
// //   },
// //   deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", default: null },
// //   createdAt: { type: Date, default: Date.now },
// // });


// // module.exports = mongoose.model("LiveOrder", LiveOrderSchema);
// // const mongoose = require("mongoose");

// // const LiveOrderSchema = new mongoose.Schema({
// //   restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
// //   userEmail: String,
// //   items: [
// //     {
// //       itemId: String,
// //       itemName: String,
// //       price: Number,
// //       quantity: Number,
// //     },
// //   ],
// //   total: Number,
// //   status: {
// //     type: String,
// //     enum: [
// //       "Placed",
// //       "Accepted",
// //       "Preparing",
// //       "Ready",
// //       "Out for Delivery",
// //       "Delivered",
// //     ],
// //     default: "Placed",
// //   },
// //   deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
// //   createdAt: { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.model("LiveOrder", LiveOrderSchema);
// const mongoose = require("mongoose");

// const LiveOrderSchema = new mongoose.Schema({
//   // 🧑 User Information
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",
//     required: true 
//   },
//   userEmail: { 
//     type: String, 
//     required: true 
//   },

//   // 🍽 Restaurant Info
//   restaurantId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Restaurant",
//     required: true 
//   },

//   // 🧾 Ordered Items
//   items: [
//     {
//       itemId: { type: String, required: true },
//       itemName: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],

//   // 💰 Total Order Amount
//   total: { 
//     type: Number, 
//     required: true, 
//     min: 0 
//   },

//   // 🚚 Delivery Partner Info
//   deliveryPartnerId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "DeliveryPartner",
//     default: null 
//   },

//   // 📦 Order Status
//   status: {
//     type: String,
//     enum: [
//       "Placed",
//       "Accepted",
//       "Preparing",
//       "Ready",
//       "Out for Delivery",
//       "Delivered",
//       "Cancelled",
//     ],
//     default: "Placed",
//   },

//   // ⏰ Automatic timestamps for better tracking
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Auto-update timestamp before saving
// LiveOrderSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("LiveOrder", LiveOrderSchema);



// // const mongoose = require("mongoose");

// // const LiveOrderSchema = new mongoose.Schema({
// //   // 🧑 User Information
// //   userId: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: "User",
// //     required: true 
// //   },
// //   userEmail: { 
// //     type: String, 
// //     required: true 
// //   },

// //   // 🍽 Restaurant Info
// //   restaurantId: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: "Restaurant",
// //     required: true 
// //   },

// //   // 🧾 Ordered Items
// //   items: [
// //     {
// //       itemId: { type: String, required: true },
// //       itemName: { type: String, required: true },
// //       price: { type: Number, required: true },
// //       quantity: { type: Number, required: true },
// //     },
// //   ],

// //   // 💰 Total Order Amount
// //   total: { 
// //     type: Number, 
// //     required: true, 
// //     min: 0 
// //   },

// //   // 🚚 Delivery Partner Info
// //   deliveryPartnerId: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: "DeliveryPartner",
// //     default: null 
// //   },

// //   // 📦 Order Status
// //   status: {
// //     type: String,
// //     enum: [
// //       "Placed",
// //       "Accepted",
// //       "Preparing",
// //       "Ready",
// //       "Out for Delivery",
// //       "Delivered",
// //       "Cancelled",
// //     ],
// //     default: "Placed",
// //   },

// //   // ⏰ Automatic timestamps for better tracking
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date, default: Date.now },
// // });

// // // Auto-update timestamp before saving
// // LiveOrderSchema.pre("save", function (next) {
// //   this.updatedAt = Date.now();
// //   next();
// // });

// // module.exports = mongoose.model("LiveOrder", LiveOrderSchema);
// const mongoose = require("mongoose"); const LiveOrderSchema = new mongoose.Schema({ restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }, userEmail: String, items: [ { itemId: String, itemName: String, price: Number, quantity: Number, }, ], total: Number, status: { type: String, enum: [ "Placed", "Accepted", "Preparing", "Ready", "Out for Delivery", "Delivered", ], default: "Placed", }, deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" }, createdAt: { type: Date, default: Date.now }, }); module.exports = mongoose.model("LiveOrder", LiveOrderSchema
const mongoose = require("mongoose");

const LiveOrderSchema = new mongoose.Schema(
  {
    // --- User & Restaurant References (REQUIRED fields for integrity) ---
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true, // Order must be linked to a restaurant
    },
    // FIX: Use userId (ObjectId) instead of userEmail (String) for querying and consistency
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assumes you have a 'User' model
      required: true, // Order must be linked to a user
    },
    
    // --- Order Details (Core Data) ---
    items: [
      {
        // Using ObjectId for item references is preferred if you have a Menu/Item model
        // Keeping as String/Number fields here for simplicity, assuming embedded data
        itemId: { type: String, required: true },
        itemName: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { 
        type: Number, 
        required: true,
        min: 0 // Total must be non-negative
    },
    
    // --- Delivery & Status Management ---
    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
        "Cancelled" // Added a common status
      ],
      default: "Placed",
      required: true,
    },
    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null, // Default to null until assigned
    },
  },
  {
    // OPTION: Automatically manage 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveOrder", LiveOrderSchema);