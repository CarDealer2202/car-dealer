import express from 'express';

import { createOrder, getAllOrders } from '@/controllers/orders.controllers';
import verification from '@/middleware/verification.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verification, getAllOrders);
router.post('/', verification, createOrder);

export default router;
