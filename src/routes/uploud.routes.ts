import { Router } from 'express';
import { getUploadSignature } from '../controllers/cloudinary.controller';
import { authenticate } from '../middleware/auth.middleware'; // sesuaikan path middleware kamu

const router = Router();

// GET /api/v1/upload/signature
// Hanya user yang sudah login yang boleh request signature
router.get('/signature', authenticate, getUploadSignature);

export default router;