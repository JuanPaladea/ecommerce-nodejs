import { Router } from "express";
import { getCartByUserId, addProductToCart, updateProductInCart, removeProductFromCart, clearCart } from "../controllers/cartsController";
import auth from "../middlewares/auth";
import isOwner from "../middlewares/isOwner";

const router = Router();

router.get('/:userId', getCartByUserId);
router.post('/:userId', auth as any, isOwner as any, addProductToCart);
router.put('/:userId', auth as any, isOwner as any, updateProductInCart);
router.delete('/:userId/:productId', auth as any, isOwner as any, removeProductFromCart);
router.delete('/:userId', auth as any, isOwner as any, clearCart);

export default router;