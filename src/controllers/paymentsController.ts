import { Request, Response } from "express";
import { client } from "../utils/mercadopago";
import { Payment } from "mercadopago";
import orderService from "../services/orderService";

export const createPaymentPreference = async (req: Request, res: Response) => {
  const payment = new Payment(client);

  try {
    const order = await orderService.getOrderById(req.params.orderId);

    const body = {
      items: order.items.map((item: any) => ({
        title: item.productId.name,
        description: item.productId.description,
        quantity: item.quantity,
        currency_id: "ARS",
        unit_price: item.productId.price,
      })),
      payer: {
        email: order.userId.email,
      },
      external_reference: order._id,
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
    }

    payment.create({ body }).then((response) => {
      res.status(200).send(response.body);
    }).catch((error) => {
      throw error;
    }
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};


