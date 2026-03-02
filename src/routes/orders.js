import express from "express";
import {
  createOrder,
  listOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("waiter", "admin"), createOrder);
router.get("/", authorize("waiter", "kitchen", "admin"), listOrders);
router.patch("/:id/status", authorize("kitchen", "admin"), updateOrderStatus);

export default router;
