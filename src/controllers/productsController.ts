import { Request, Response } from "express";

import productsService from "../services/productsService";
import logger from "../utils/logger";
import Product from "../types/Product";

export const getProducts = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;
  const page = req.query.page ? parseInt(String(req.query.page)) : 1;
  const search = req.query.search ? String(req.query.search) : '';
  const sort = req.query.sort ? String(req.query.sort) : 'name';

  try {
    const products = await productsService.getProducts(limit, page, search, sort);
    res.status(200).send(products);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}

export const getProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId;

  try {
    const product = await productsService.getProductById(productId);
    res.status(200).send(product);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const product: Product = req.body;

  try {
    const newProduct = await productsService.createProduct(product);
    res.status(201).send(newProduct);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const product: Product = req.body;

  try {
    const updatedProduct = await productsService.updateProduct(productId, product);
    res.status(200).send(updatedProduct);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await productsService.deleteProduct(productId);
    res.status(200).send(deletedProduct);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}