import bcrypt from "bcryptjs";
import DeliveryPartner from "../models/DeliveryPartner.js";
import LiveOrder from "../models/LiveOrder.js";

export const registerPartner = async (req, res) => {
const { name, email, password, vehicleNo } = req.body;
const hashed = await bcrypt.hash(password, 10);
await new DeliveryPartner({ name, email, password: hashed, vehicleNo }).save();
res.send("✅ Registered delivery partner!");
};

export const loginPartner = async (req, res) => {
const { email, password } = req.body;
const partner = await DeliveryPartner.findOne({ email });
if (!partner) return res.send("Partner not found");
const ok = await bcrypt.compare(password, partner.password);
if (!ok) return res.send("Wrong password");
req.session.partnerId = partner._id;
res.redirect("/delivery/assignments");
};

export const viewAssignments = async (req, res) => {
const orders = await LiveOrder.find({ deliveryPartnerId: req.session.partnerId });
res.send(
orders.length
? orders.map((o) => `<div>Order ${o._id} - ${o.status}</div>`).join("")
: "No assignments yet"
);
};
