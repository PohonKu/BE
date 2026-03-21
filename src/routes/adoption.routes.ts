// src/routes/adoption.routes.ts
import { Router } from 'express';
import { adoptionController } from '../controllers/adoption.controller';
import { treeUpdateController } from '../controllers/treeUpdate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/admin/all', adoptionController.getAllAdoptionsAdmin);
router.get('/stats', adoptionController.getDashboardStats);
router.get('/statistik', adoptionController.getDashboarBaru);
router.get('/detail', adoptionController.getUserAdoptionBaru);
router.get('/dashboard', adoptionController.getDashboard);

router.get('/updates', adoptionController.getAllAdoptionsWithUpdates);

router.get('/', adoptionController.getUserAdoptions);
router.get('/:id', adoptionController.getAdoptionDetail);

router.get('/:adoptionId/updates', authenticate, treeUpdateController.getUpdatesByAdoptionId);



export default router;