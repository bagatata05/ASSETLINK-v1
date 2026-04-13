import { Router } from 'express';
import { schoolController } from '../controllers/SchoolController';
import { verifyToken } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.use(verifyToken);

router.get('/', asyncErrorWrapper(schoolController.getAll));
router.get('/:id', asyncErrorWrapper(schoolController.getById));

export default router;
