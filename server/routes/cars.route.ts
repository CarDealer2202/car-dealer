import express from 'express';

import Car from '../models/Car';

interface Query {
  brand?: { $regex: RegExp };
  model?: { $regex: RegExp };
}

const router = express.Router({ mergeParams: true });

router.get('/', async (request, response) => {
  const { page = 1, limit = 9, sort = 'name', order = 'asc', brand, model } = request.query;
  try {
    const orderValue = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;
    const query: Query = {};
    if (brand) {
      query.brand = { $regex: new RegExp(`${brand}`, 'i') };
    } else if (model) {
      query.model = { $regex: new RegExp(`${model}`, 'i') };
    }
    const cars = await Car.find(query)
      .sort({ [sort as string]: orderValue })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit)
      .exec();

    const count = await Car.countDocuments();

    response.status(200).send({
      cars,
      totalPages: Math.ceil(count / +limit),
      currentPage: +page,
    });
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
