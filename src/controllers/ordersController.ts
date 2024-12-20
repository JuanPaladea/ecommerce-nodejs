import { Request, Response } from "express";

import logger from "../utils/logger";
import orderService from "../services/orderService";

export const getOrdersByUserId = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id

  try {
    const orders = await orderService.getOrdersByUserId(userId);
    res.status(200).send(orders);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  try {
    const order = await orderService.getOrderById(orderId);
    res.status(200).send(order);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const createOrder = async (req: Request & { user: { _id: string } }, res: Response)  => {
  const userId = req.user._id;
  const shippingInfo = req.body.shippingInfo;
  const paymentInfo = req.body.paymentInfo;

  try {
    const order = await orderService.createOrder(userId, shippingInfo, paymentInfo);
    res.status(201).send(order);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const status = req.body.status;

  try {
    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(200).send(order);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;

  try {
    const order = await orderService.deleteOrder(orderId);
    res.status(200).send(order);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}