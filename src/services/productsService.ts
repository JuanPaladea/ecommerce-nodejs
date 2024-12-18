import productsModel from "../models/productsModel";
import Product from "../types/Product";
import logger from "../utils/logger";

class ProductsService {
  async getProducts(limit: number, page: number, search: string, sort: string) {
    const searchFilter = search ?
    {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    } : {};

    try {
      const response = await productsModel.find(searchFilter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort)

      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getProductById(productId: string) {
    try {
      const response = await productsModel.findById(productId);
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async createProduct(product: Product) {
    try {
      const response = await productsModel.create(product);
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateProduct(productId: string, product: Product) {
    try {
      const response = await productsModel.findByIdAndUpdate(productId, product, { new: true });
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      const response = await productsModel.findByIdAndDelete(productId);
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

}

export default new ProductsService();