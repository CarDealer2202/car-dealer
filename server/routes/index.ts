import express from 'express';

import carsRouter from './cars.route';
import typesRouter from './types.route';

const router = express.Router({ mergeParams: true });

router.use('/cars', carsRouter);
router.use('/types', typesRouter);

export default router;
