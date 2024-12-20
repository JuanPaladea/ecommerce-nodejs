import { Router } from "express";
import { getOrdersByUserId, getOrderById, createOrder, updateOrderStatus, deleteOrder } from "../controllers/ordersController";

import auth from "../middlewares/auth";

const router = Router();

router.get('/', auth as any, getOrdersByUserId as any);
router.post('/', auth as any, createOrder as any);
router.get('/:orderId', auth as any, getOrderById);
router.put('/:orderId', auth as any, updateOrderStatus);
router.delete('/:orderId', auth as any, deleteOrder);

export default router;