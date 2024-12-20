import { Router } from "express";
import { getCartByUserId, addProductToCart, updateProductInCart, removeProductFromCart, clearCart } from "../controllers/cartsController";
import auth from "../middlewares/auth";
import isOwner from "../middlewares/isOwner";
const router = Router();

router.get('/', auth as any, getCartByUserId as any);
router.post('/', auth as any, addProductToCart as any);
router.put('/', auth as any, updateProductInCart as any);
router.delete('/', auth as any, clearCart as any);
router.delete('/:productId', auth as any, removeProductFromCart as any);

export default router;