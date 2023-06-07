import express from 'express';

import { getAllCar, getCarById } from '@/controllers/cars.controllers';

const router = express.Router({ mergeParams: true });

router.get('/', getAllCar);
router.get('/:carId', getCarById);

export default router;
