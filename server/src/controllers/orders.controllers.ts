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

export const getAllAdminOrders = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { page = 1, limit = 9, sort = 'createdAt', order = 'desc' } = request.query;

  try {
    const orderValue = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;
    const orders = await Order.find()
      .sort({ [sort as string]: orderValue })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit)
      .exec();

    const count = await Order.countDocuments();

    return response.status(200).send({
      orders,
      totalPages: Math.ceil(count / +limit),
      currentPage: +page,
    });
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
          return response.status(404).json({
            message: `car id = ${carId} does not exist`,
            carId,
          });
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

export const updateOrderById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  try {
    if (!id || !request.body.status) {
      return response.status(400).send({
        message: 'invalid request',
        id,
        status: request.body.status,
      });
    }

    const existedOrder = await Order.findById(id);

    if (!existedOrder) {
      return response.status(404).send({
        message: `not found order with id ${id}`,
      });
    }

    existedOrder.status = request.body.status;
    const order = await existedOrder.save();

    return response.status(200).send(order);
  } catch (error) {
    console.error(error);
    return response.status(500).send({
      message: 'an error occurred on the server side while updating the order',
      id,
      status: request.body.status,
    });
  }
};
