import { Router } from 'express';
import { submitContactInquiry } from '../controllers/contactController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', asyncHandler(submitContactInquiry));

export default router;
