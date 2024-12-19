import logger from "../utils/logger";
import cartModels from "../models/cartsModel";
import productsModel from "../models/productsModel";

class CartService {
  async getCartByUserId(userId: string) {
    try {
      const response = await cartModels.findOne({ userId });
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async addProductToCart(userId: string, productId: string, quantity: number) {
    try {
      const product = await productsModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      let cart = await cartModels.findOne({ userId });

      if (!cart) {
        cart = new cartModels({
          userId,
          items: [{ productId, quantity, price: product.price }],
        });
      }

      const existingItem = cart.items.find((item) => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }

      await cart.save();
      return cart;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateProductInCart(userId: string, productId: string, quantity: number) {
    try {
      const cart = await cartModels.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const item = cart.items.find((item) => item.productId.toString() === productId);
      if (!item) {
        throw new Error("Product not found in cart");
      }

      const product = await productsModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      item.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async removeProductFromCart(userId: string, productId: string) {
    try {
      const cart = await cartModels.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.items = cart.items.filter((item) => item.productId.toString() !== productId) as any;
      await cart.save();
      return cart;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async emptyCart(userId: string) {
    try {
      const cart = await cartModels.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.items = [] as any;
      await cart.save();
      return cart;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default new CartService();