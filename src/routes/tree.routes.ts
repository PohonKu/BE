import { Router } from 'express';
import { treeController } from '../controllers/tree.controller';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();


router.get('/species', treeController.getAllSpecies);
router.get('/species/category/:category', treeController.getSpeciesByCategory);
router.get('/species/:id', treeController.getSpeciesById)
router.get('/', treeController.getAvailableTrees)


router.post('/species', treeController.postSpecies)
router.post('/species/bulk', treeController.bulkCreateSpecies)
router.patch('/species/:id', authenticate, treeController.updateSpecies);

export default router;

