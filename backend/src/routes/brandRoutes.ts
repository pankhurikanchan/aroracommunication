import { Router } from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getBrands);
router.post('/', authenticateToken, requireAdmin, createBrand);
router.put('/:id', authenticateToken, requireAdmin, updateBrand);
router.delete('/:id', authenticateToken, requireAdmin, deleteBrand);

export default router;
