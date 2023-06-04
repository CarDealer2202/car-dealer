import express from 'express';

import { getAllOrders } from '@/controllers/orders.controllers';
import verification from '@/middleware/verification.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verification, getAllOrders);

export default router;
