import { Router } from 'express';
import { maintenanceTaskController } from '../controllers/MaintenanceTaskController';
import { verifyToken } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.use(verifyToken);

router.get('/', asyncErrorWrapper(maintenanceTaskController.getAll));
router.get('/:id', asyncErrorWrapper(maintenanceTaskController.getById));
router.post('/', asyncErrorWrapper(maintenanceTaskController.create));
router.patch('/:id', asyncErrorWrapper(maintenanceTaskController.update));

export default router;
