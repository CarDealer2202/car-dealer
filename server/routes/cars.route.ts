import express from 'express';

import Car from '../models/Car';

const router = express.Router({ mergeParams: true });

router.get('/', async (request, response) => {
  try {
    const cars = await Car.find();

    response.status(200).send(cars);
  } catch (error) {
    if (error instanceof Error) {
      response.status(500).json({
        message: `failed to get a list of machines on the server, error text: ${error.message}`,
      });
    } else {
      response.status(500).json({
        message: `failed to get a list of machines on the server, error text: ${error}`,
      });
    }
  }
});

router.get('/:carId', async (request, response) => {
  const { carId } = request.params;

  try {
    const car = await Car.findById(carId);
    response.status(200).send(car);
  } catch (error) {
    response.status(500).json({
      message: `failed to get car for id: ${carId}`,
    });
  }
});

export default router;
