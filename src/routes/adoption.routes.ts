// src/routes/adoption.routes.ts
import { Router } from 'express';
import { adoptionController } from '../controllers/adoption.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/stats', adoptionController.getDashboardStats);
router.get('/', adoptionController.getUserAdoptions);
router.get('/:id', adoptionController.getAdoptionDetail);
router.get('/statistik', adoptionController.getDashboarBaru);
router.get('/detail', adoptionController.getUserAdoptionBaru);


export default router;