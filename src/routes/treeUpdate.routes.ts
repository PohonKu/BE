import { Router } from 'express';
import { treeUpdateController } from '../controllers/treeUpdate.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeAdmin } from '../middleware/admin.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate, authorizeAdmin);

router.post('/', treeUpdateController.createTreeUpdate);
router.get('/', treeUpdateController.getUpdatesByTreeId);
router.patch('/:updateId', treeUpdateController.updateTreeUpdate);
router.delete('/:updateId', treeUpdateController.deleteTreeUpdate);

export default router;