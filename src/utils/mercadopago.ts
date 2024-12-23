import { MercadoPagoConfig, Payment } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from '../config/envs';

export const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN, options: { timeout: 5000, idempotencyKey: 'abc' } });