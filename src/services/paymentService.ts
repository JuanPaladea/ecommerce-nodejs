import stripe from "../utils/stripe";
import paymentsModel from "../models/paymentsModel";
import logger from "../utils/logger";

class PaymentService {
  async createPayment(orderId: string, amount: number) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        confirmation_method: "manual",
        confirm: true,
      });

      const payment = new paymentsModel({
        orderId,
        amount,
        currency: "usd",
        paymentMethod: "credit card",
        paymentStatus: paymentIntent.status,
      });

      await payment.save();

      return payment;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default new PaymentService();