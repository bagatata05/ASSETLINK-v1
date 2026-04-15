import { Router } from 'express';
import { repairController } from '../controllers/RepairController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.use(verifyToken);

router.get('/', asyncErrorWrapper(repairController.getAll));
router.get('/:id', asyncErrorWrapper(repairController.getById));

router.post('/', checkRole(['teacher', 'principal']), asyncErrorWrapper(repairController.create));
router.patch('/:id', checkRole(['principal', 'maintenance', 'teacher']), asyncErrorWrapper(repairController.update));
router.patch('/:id/status', checkRole(['principal', 'maintenance']), asyncErrorWrapper(repairController.updateStatus));

export default router;
