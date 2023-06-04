import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';

import Car from '@/models/Car';
import Order from '@/models/Order';

export const getAllOrders = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { page = 1, limit = 9, sort = 'createdAt', order = 'asc' } = request.query;

  try {
    const orderValue = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;
    const list = await Order.find({ userId: request.user?._id })
      .sort({ [sort as string]: orderValue })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit)
      .exec();

    return response.status(200).send(list);
  } catch (error) {
    return response.status(401).json({
      message: 'unauthorized',
    });
  }
};

export const createOrder = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { cars } = request.body;

    const totalPrice = await cars.reduce(async (totalPromise: number, carId: ObjectId) => {
      const total = await totalPromise;
      const currentCar = await Car.findById(carId);
      if (!currentCar) {
        throw new Error(`car with id ${carId} does not exist`);
      }
      return total + ((currentCar && currentCar.price) || 0); // ! check
    }, Promise.resolve(0));

    const newOrder = await Order.create({
      ...request.body,
      totalPrice,
      userId: request.user?._id,
    });
    return response.status(201).send(newOrder);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(401).json({
        message: error.message,
      });
    } else {
      return response.status(401).json({
        message: 'unauthorized',
      });
    }
  }
};
