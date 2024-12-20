import { Router } from "express";
import { registerUser, loginUser, logoutUser, deleteUser } from "../controllers/usersController";
import auth from "../middlewares/auth";

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/logout', auth as any, logoutUser);
router.delete('/', auth as any, deleteUser as any);

export default router;