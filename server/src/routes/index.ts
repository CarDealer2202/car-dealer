import express from 'express';

import carsRouter from './cars.routes';
import typesRouter from './types.routes';

const router = express.Router({ mergeParams: true });

router.use('/cars', carsRouter);
router.use('/types', typesRouter);

export default router;
