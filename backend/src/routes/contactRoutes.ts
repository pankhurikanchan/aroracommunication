import { Router } from 'express';
import { submitContactInquiry } from '../controllers/contactController';

const router = Router();

router.post('/', submitContactInquiry);

export default router;
