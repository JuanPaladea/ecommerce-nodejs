import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI!;
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;