import { Request, Response } from "express";

import logger from "../utils/logger";
import paymentService from "../services/paymentService";
import orderService from "../services/orderService";

export const createPayment = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  try {
    const order = await orderService.getOrderById(orderId);

    const amount = order.totalAmount as number;

    const payment = await paymentService.createPayment(orderId, amount);

    order.payment = payment._id;
    order.save();

    res.status(201).send(payment);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}
