import { Router } from 'express';
import { maintenanceTaskController } from '../controllers/MaintenanceTaskController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.use(verifyToken);

router.get('/', asyncErrorWrapper(maintenanceTaskController.getAll));
router.get('/:id', asyncErrorWrapper(maintenanceTaskController.getById));
router.post('/', checkRole(['principal']), asyncErrorWrapper(maintenanceTaskController.create));
router.patch('/:id', checkRole(['maintenance', 'principal']), asyncErrorWrapper(maintenanceTaskController.update));

export default router;
