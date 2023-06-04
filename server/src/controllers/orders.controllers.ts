import { Request, Response } from 'express';

import Order from '@/models/Order';

export const getAllOrders = async (request: Request, response: Response) => {
  const { page = 1, limit = 9, sort = 'createdAt', order = 'asc' } = request.query;

  try {
    const orderValue = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;
    const list = await Order.find({ userId: request.user?._id })
      .sort({ [sort as string]: orderValue })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit)
      .exec();

    response.status(200).send(list);
  } catch (error) {
    return response.status(401).json({
      message: 'unauthorized',
    });
  }
};
