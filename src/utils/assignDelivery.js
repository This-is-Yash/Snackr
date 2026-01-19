// const DeliveryPartner = require("../models/DeliveryPartner");

// async function assignDeliveryPartner(order) {
//   // Find any available delivery partner
//   const partner = await DeliveryPartner.findOne({ status: "Available" });
//   if (partner) {
//     partner.status = "Busy";
//     await partner.save();

//     order.deliveryPartnerId = partner._id;
//     order.status = "Out for Delivery";
//     await order.save();

//     console.log(`🚚 Assigned ${partner.name} to order ${order._id}`);
//   } else {
//     console.log("⚠️ No available delivery partner at the moment.");
//   }
// }

// module.exports = assignDeliveryPartner;
const DeliveryPartner = require("../models/DeliveryPartner");
const LiveOrder = require("../models/LiveOrder");

/**
 * Assigns an available delivery partner to the given order.
 * @param {LiveOrder} order - LiveOrder document
 */
async function assignDelivery(order) {
  try {
    // Find one available partner
    const partner = await DeliveryPartner.findOne({ status: "Available" });

    if (!partner) {
      console.log("⚠️ No delivery partner currently available.");
      return null;
    }

    // Update order
    order.deliveryPartnerId = partner._id;
    order.deliveryPartnerEmail = partner.email;
    order.status = "Out for Delivery";
    await order.save();

    // Update partner status
    partner.status = "Busy";
    await partner.save();

    console.log(`🚚 Assigned ${partner.name} (${partner.email}) to order ${order._id}`);
    return partner;
  } catch (err) {
    console.error("❌ Error assigning delivery partner:", err.message);
  }
}

module.exports = assignDelivery;
