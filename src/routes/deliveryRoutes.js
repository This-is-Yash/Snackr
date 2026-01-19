import express from "express";
import { registerPartner, loginPartner, viewAssignments } from "../controllers/deliveryController.js";

const router = express.Router();

router.post("/register", registerPartner);
router.post("/login", loginPartner);
router.get("/assignments", viewAssignments);

export default router;
