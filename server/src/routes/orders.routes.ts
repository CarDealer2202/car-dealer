import express from 'express';

import { createOrder, deleteOrderById, getAllOrders } from '@/controllers/orders.controllers';
import authentication from '@/middleware/authentication.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', authentication, getAllOrders);
router.post('/', authentication, createOrder);
router.delete('/:id', authentication, deleteOrderById);

export default router;
