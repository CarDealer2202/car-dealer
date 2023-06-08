import { Request, Response } from 'express';

import Car from '@/models/Car';
import Order from '@/models/Order';
import { RequestCar } from '@/types/car.types';

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

    const totalPrice = await cars.reduce(
      async (totalPromise: number, { carId }: RequestCar) => {
        const total = await totalPromise;
        const currentCar = await Car.findById(carId);
        if (!currentCar) {
          throw new Error(`car with id ${carId} does not exist`);
        }
        return total + ((currentCar && currentCar.price) || 0);
      },
      Promise.resolve(0)
    );

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

export const deleteOrderById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { id } = request.params;

    const removedOrder = await Order.findById(id);

    if (removedOrder?.userId.toString() === request.user?._id) {
      await removedOrder?.deleteOne();
      return response.send(null);
    } else {
      return response.status(401).json({
        message: 'you are not the owner of this order',
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: 'an error occurred on the server',
    });
  }
};
