import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Only admin, principal, and supervisor can list users
// Only admin, principal, supervisor, and teacher (to see assigned staff) can list users
router.get('/', verifyToken, checkRole(['admin', 'principal', 'supervisor', 'teacher']), userController.list);

export default router;
