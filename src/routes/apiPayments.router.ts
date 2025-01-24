import { Router } from "express";

import { createPayment } from "../controllers/paymentsController";
import auth from "../middlewares/auth";

const router = Router();

router.post('/checkout', auth as any, createPayment)

export default router;