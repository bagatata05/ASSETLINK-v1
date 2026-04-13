import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { verifyToken } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.get('/me', verifyToken, asyncErrorWrapper(authController.me));

export default router;
