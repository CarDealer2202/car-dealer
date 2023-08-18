import express from 'express';

import {
  createOrder,
  deleteOrderById,
  getAllAdminOrders,
  getAllOrders,
  updateOrderById,
} from '@/controllers/orders.controllers';
import authentication from '@/middleware/authentication.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', authentication, getAllOrders);
router.get('/all', authentication, getAllAdminOrders);
router.post('/', authentication, createOrder);
router.delete('/:id', authentication, deleteOrderById);
router.patch('/:id', authentication, updateOrderById);

export default router;
