import bcrypt from "bcryptjs";
import Restaurant from "../models/Restaurant.js";
import Menu from "../models/Menu.js";
import LiveOrder from "../models/LiveOrder.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const restaurantDashboard = (req, res) => {
res.sendFile(path.join(__dirname, "../../public/restaurant.html"));
};

export const registerRestaurant = async (req, res) => {
const { name, email, password, address, type } = req.body;
const hashed = await bcrypt.hash(password, 10);
await new Restaurant({ name, email, password: hashed, address, type }).save();
res.redirect("/restaurant");
};

export const loginRestaurant = async (req, res) => {
const { email, password } = req.body;
const rest = await Restaurant.findOne({ email });
if (!rest) return res.send("Restaurant not found");
const ok = await bcrypt.compare(password, rest.password);
if (!ok) return res.send("Wrong password");
req.session.restaurantId = rest._id;
res.redirect(`/restaurant/${rest._id}/orders`);
};

export const addMenuItem = async (req, res) => {
const { name, price, category } = req.body;
await new Menu({
restaurantId: req.params.id,
name,
price,
category,
}).save();
res.redirect(`/restaurant/${req.params.id}/orders`);
};

export const viewOrders = async (req, res) => {
const orders = await LiveOrder.find({ restaurantId: req.params.id }).lean();
res.send(
orders.length
? orders.map((o) => `<div>Order ${o._id} - ${o.status}</div>`).join("")
: "No orders"
);
};

export const updateOrderStatus = async (req, res) => {
await LiveOrder.findByIdAndUpdate(req.params.orderId, { status: req.body.status });
res.redirect(`/restaurant/${req.params.id}/orders`);
};
