import express from "express";
import { confirmOrder, restaurantOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/confirm", confirmOrder);
router.get("/restaurant/:id", restaurantOrders);
router.post("/restaurant/:id/:orderId/update", updateOrderStatus);

export default router;
