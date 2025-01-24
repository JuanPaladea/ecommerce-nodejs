import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config/envs";

const stripe = new Stripe(STRIPE_SECRET_KEY)

export default stripe;