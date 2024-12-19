
import logger from "../utils/logger";
import Shipping from "../types/Shipping";
import Payment from "../types/Payment";

import ordersModel from "../models/ordersModel";
import cartsModel from "../models/cartsModel";
import productsModel from "../models/productsModel";
import shippingModel from "../models/shippingsModel";
import paymentsModel from "../models/paymentsModel";

class OrderService {
  async getOrdersByUserId(userId: string) {
    try {
      const response = await ordersModel.find({ userId }).populate("items.productId").populate("userId", "name email").populate("payment").populate("shipping");
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async createOrder(userId: string, shipping: Shipping, payment: Payment) {
    try {
      const cart = await cartsModel.findOne({ userId }).populate("items.productId");
      if (!cart) {
        throw new Error("Cart not found");
      }

      if (cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      for (const item of cart.items) {
        const product = await productsModel.findById(item.productId._id);
        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
          throw new Error("Insufficient stock");
        }
      }

      const order = new ordersModel({
        userId,
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.quantity * item.price,
        })),
        status: "pending",
      });

      const newPayment = new paymentsModel({
        orderId: order._id,
        paymentMethod: payment.paymentMethod,
        amount: order.items.reduce((acc, item) => acc + item.totalPrice, 0),
      });
      await newPayment.save();

      const newShipping = new shippingModel({
        orderId: order._id,
        shippingAddress: {
          address: shipping.shippingAddress.address,
          city: shipping.shippingAddress.city,
          state: shipping.shippingAddress.state,
          zipCode: shipping.shippingAddress.zipCode,
        },
        shippingMethod: shipping.shippingMethod,
      })
      await newShipping.save();

      order.shipping = newShipping._id;
      order.payment = newPayment._id;

      // Update stock of products
      for (const item of order.items) {
        const product = await productsModel.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          throw new Error("Product not found");
        }
      }

      await cartsModel.findOneAndUpdate({ userId }, { items: [] });
      await order.save();
      return order;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    try {
      const response = await ordersModel.findById(orderId).populate("items.productId").populate("userId", "name email").populate("payment").populate("shipping");
      if (!response) {
        throw new Error("Order not found");
      }
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" ) {
    try {
      const order = await ordersModel.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
  
      order.status = status;
      await order.save();
      return order;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteOrder(orderId: string) {
    try {
      const order = await ordersModel.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
  
      order.status = "cancelled";

      for (const item of order.items) {
        const product = await productsModel.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      await order.save();
      return order;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default new OrderService();