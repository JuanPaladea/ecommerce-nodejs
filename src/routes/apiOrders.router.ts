import { Router } from "express";
import { getOrdersByUserId, getOrderById, createOrder, updateOrderStatus, deleteOrder } from "../controllers/ordersController";

import auth from "../middlewares/auth";
import isOwner from "../middlewares/isOwner";

const router = Router();

router.get('/:userId', auth as any, isOwner as any, getOrdersByUserId);
router.post('/:userId', auth as any, isOwner as any, createOrder);
router.get('/:userId/:orderId', auth as any, isOwner as any, getOrderById);
router.put('/:orderId', auth as any, isOwner as any, updateOrderStatus);
router.delete('/:orderId', auth as any, isOwner as any, deleteOrder);

export default router;