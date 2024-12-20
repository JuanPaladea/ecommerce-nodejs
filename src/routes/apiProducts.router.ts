import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productsController";
import isAdmin from "../middlewares/isAdmin";
import auth from "../middlewares/auth";

const router = Router();

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', auth as any, isAdmin as any, createProduct);
router.put('/:productId', auth as any, isAdmin as any, updateProduct);
router.delete('/:productId', auth as any, isAdmin as any, deleteProduct);

export default router;