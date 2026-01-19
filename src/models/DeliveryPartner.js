const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  vehicleNo: {type:String,unique:true}
});

module.exports = mongoose.model("DeliveryPartner", deliverySchema);
