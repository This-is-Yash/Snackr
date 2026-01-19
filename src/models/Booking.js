const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  name: String,       // user name
  email: String,      // user email
  phone: String,      // contact number
  date: String,       // booking date
  time: String,       // booking time
  guests: Number,     // number of people
  specialRequest: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
