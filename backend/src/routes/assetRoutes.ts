import { Router } from 'express';
import { assetController } from '../controllers/AssetController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';

const router = Router();

router.use(verifyToken);

router.get('/', asyncErrorWrapper(assetController.getAll));
router.get('/:id', asyncErrorWrapper(assetController.getById));

router.post('/', checkRole(['admin', 'principal']), asyncErrorWrapper(assetController.create));
router.put('/:id', checkRole(['admin', 'principal']), asyncErrorWrapper(assetController.update));
router.delete('/:id', checkRole(['admin']), asyncErrorWrapper(assetController.delete));

export default router;
