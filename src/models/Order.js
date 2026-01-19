const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  items: [
    {
      itemName: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  status: { type: String, default: "Placed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
