import {Router} from 'express';
import { treeController } from '../controllers/tree.controller';

const router = Router();


router.get('/species', treeController.getAllSpecies);
router.get('/species/category/:category', treeController.getSpeciesByCategory);
router.get('/species/:id', treeController.getSpeciesById)
router.get('/', treeController.getAvailableTrees)
router.post('/species', treeController.postSpecies)
router.post('/species/bulk', treeController.bulkCreateSpecies)


export default router;

