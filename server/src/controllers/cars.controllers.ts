import { Request, Response } from 'express';

import Car from '@/models/Car';
import getAllCarsWithPagination from '@/utils/helpers/getAllCarsWithPagination';
import getTopCarSales from '@/utils/helpers/getTopCarSales';

export const getAllCar = async (request: Request, response: Response): Promise<Response> => {
  const {
    page = 1,
    limit = 9,
    sort = 'name',
    order = 'asc',
    brand,
    model,
    minPrice = 0,
    maxPrice,
    type,
  } = request.query;
  try {
    const orderValue = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;

    if (sort === 'sale') {
      const topCars = await getTopCarSales(orderValue, +limit);
      return response.status(200).send(topCars);
    } else {
      const [cars, count] = await getAllCarsWithPagination({
        brand: brand as string,
        model: model as string,
        sort: sort as string,
        type: type as string,
        orderValue,
        limit: +limit,
        page: +page,
        minPrice: +minPrice,
        maxPrice: maxPrice as undefined,
      });

      return response.status(200).send({
        cars,
        totalPages: Math.ceil(count / +limit),
        currentPage: +page,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return response.status(500).json({
        message: `failed to get a list of machines on the server, error text: ${error.message}`,
      });
    } else {
      return response.status(500).json({
        message: `failed to get a list of machines on the server, error text: ${error}`,
      });
    }
  }
};

export const getCarById = async (request: Request, response: Response): Promise<void> => {
  const { carId } = request.params;

  try {
    const car = await Car.findById(carId);
    response.status(200).send(car);
  } catch (error) {
    response.status(500).json({
      message: `failed to get car for id: ${carId}`,
    });
  }
};
