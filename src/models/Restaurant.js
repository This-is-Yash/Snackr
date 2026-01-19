// const mongoose = require("mongoose");

// const restaurantSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   address: String
// });

// module.exports = mongoose.model("Restaurant", restaurantSchema);
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  // --- NEW FIELDS ADDED ---
  type: { // Stores 'Home' or 'Normal'
    type: String,
    enum: ['Home', 'Normal'],
    required: true 
  },
  cuisine: { // Stores the cuisine type (e.g., 'Italian')
    type: String,
    required: true 
  },
  size: { // Number of tables
    type: Number,
    min: 0,
    default: 0
  },
  capacity: { // Total seating capacity
    type: Number,
    min: 0,
    default: 0
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);