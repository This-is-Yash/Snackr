// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// module.exports = mongoose.model("User", userSchema);
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    flat: { type: String, required: true },
    building: { type: String, required: true },
    region: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
