const mongoose = require("mongoose");
const { Schema } = mongoose;

const donationSchema = new mongoose.Schema(
  {
    // Link to the receiving shelter
    shelterId: {
      type: Schema.Types.ObjectId,
      ref: "FoodShelter",
      required: true,
    },
    // Link to the source (e.g., a Restaurant or a User)
    sourceType: {
      type: String,
      enum: ["Restaurant", "User"],
      required: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: true, // This will be the Restaurant ID or User ID
    },
    sourceName: {
      type: String, // Name of the donor
      required: true,
    },
    // Details of the donated food
    items: [
      {
        description: { type: String, required: true }, // E.g., "5 lbs cooked rice" or "10 boxed sandwiches"
        quantity: { type: Number, required: true, min: 1 },
        bestBy: { type: Date }, // Optional: Expiration Date
      },
    ],
    // Status of the donation pickup/drop-off
    status: {
      type: String,
      enum: [
        "Pending Pickup",
        "Assigned to Delivery Partner",
        "Received by Shelter",
        "Completed",
        "Cancelled",
      ],
      default: "Pending Pickup",
    },
    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);