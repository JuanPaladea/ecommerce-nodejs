import logger from "../utils/logger";
import cartModels from "../models/cartsModel";
import productsModel from "../models/productsModel";

class CartService {
  async getCartByUserId(userId: string) {
    try {
      const response = await cartModels.findOne({ userId }).populate("items.productId").populate("userId", "name email");
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async addProductToCart(userId: string, productId: string, quantity: number) {
    try {
      // Check if product exists
      const product = await productsModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      let cart = await cartModels.findOne({ userId });

      // If cart does not exist, create a new cart and add the product
      if (!cart) {
        // Check if stock is sufficient
        if (product.stock < quantity) {
          throw new Error("Insufficient stock");
        }
        cart = new cartModels({
          userId,
          items: [{ productId, quantity, price: product.price }],
        });
      }

      // Check if product already exists in cart
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);

      // If product exists, update the quantity
      if (existingItem) {
        // Check if stock is sufficient
        if (product.stock < existingItem.quantity + quantity) {
          throw new Error("Insufficient stock");
        }
        existingItem.quantity += quantity;
      // If product does not exist, add the product to cart
      } else {
        // Check if stock is sufficient
        if (product.stock < quantity) {
          throw new Error("Insufficient stock");
        }
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

  async clearCart(userId: string) {
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