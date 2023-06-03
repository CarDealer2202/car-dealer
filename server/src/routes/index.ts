import express from 'express';

import authRouter from './auth.routes';
import carsRouter from './cars.routes';
import typesRouter from './types.routes';

const router = express.Router({ mergeParams: true });

router.use('/cars', carsRouter);
router.use('/types', typesRouter);
router.use('/auth', authRouter);

export default router;
