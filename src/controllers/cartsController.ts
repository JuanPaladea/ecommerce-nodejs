import { Request, Response } from "express";

import logger from "../utils/logger";
import cartService from "../services/cartService";

export const getCartByUserId = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id

  try {
    const cart = await cartService.getCartByUserId(userId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

export const addProductToCart = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id
  const { productId, quantity } = req.body;

  try {
    const cart = await cartService.addProductToCart(userId, productId, quantity);
    res.status(201).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

export const updateProductInCart = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id
  const { productId, quantity } = req.body;

  try {
    const cart = await cartService.updateProductInCart(userId, productId, quantity);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

export const removeProductFromCart = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id
  const productId = req.params.productId;

  try {
    const cart = await cartService.removeProductFromCart(userId, productId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

export const clearCart = async (req: Request & { user: { _id: string } }, res: Response) => {
  const userId = req.user._id

  try {
    const cart = await cartService.clearCart(userId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message });
  }
}

