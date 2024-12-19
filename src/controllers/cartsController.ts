import { Request, Response } from "express";

import logger from "../utils/logger";
import cartService from "../services/cartService";

export const getCartByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cart = await cartService.getCartByUserId(userId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const addProductToCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    const cart = await cartService.addProductToCart(userId, productId, quantity);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const updateProductInCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    const cart = await cartService.updateProductInCart(userId, productId, quantity);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const removeProductFromCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    const cart = await cartService.removeProductFromCart(userId, productId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cart = await cartService.clearCart(userId);
    res.status(200).send(cart);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

