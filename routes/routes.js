import { Router } from 'express';
const router = Router();

import productRoutes from './products';

router.use(productRoutes);

export default router;