import { Router } from 'express';
import multer from 'multer';
import { photoController } from '../controllers/PhotoController';
import { asyncErrorWrapper } from '../middleware/asyncErrorWrapper';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', asyncErrorWrapper(photoController.streamPhoto));

// Protected upload route
router.post('/upload', verifyToken, upload.single('file'), asyncErrorWrapper(photoController.upload));

export default router;
