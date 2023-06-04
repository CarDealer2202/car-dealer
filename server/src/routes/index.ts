import express from 'express';

import authRouter from './auth.routes';
import carsRouter from './cars.routes';
import ordersRouter from './orders.routes';
import typesRouter from './types.routes';

const router = express.Router({ mergeParams: true });

router.use('/cars', carsRouter);
router.use('/types', typesRouter);
router.use('/auth', authRouter);
router.use('/orders', ordersRouter);

export default router;
