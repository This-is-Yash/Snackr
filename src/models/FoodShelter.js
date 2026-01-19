const mongoose = require("mongoose");

const foodShelterSchema = new mongoose.Schema(
  {
    // Unique identifier and main name
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Shelter names should probably be unique
    },
    // Location details
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    // Contact information
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    // Operational status (e.g., Accepting Donations, Full)
    status: {
      type: String,
      enum: ["Accepting Donations", "Full Capacity", "Closed"],
      default: "Accepting Donations",
      required: true,
    },
    // Optional: Logistical details for pickups/drop-offs
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // To track when the shelter was added
  }
);

// Export the model (save this in a new file, e.g., 'models/FoodShelter.js')
module.exports = mongoose.model("FoodShelter", foodShelterSchema);