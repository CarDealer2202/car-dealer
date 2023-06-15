import { Request, Response } from 'express';

import User from '@/models/User';

export const updateUser = async (request: Request, response: Response) => {
  const { carId } = request.body;
  try {
    const existedUser = await User.findOne(request.user.id);

    if (!existedUser) {
      return response.status(401).send({
        message: `user with id ${request.user.id} for update does not exist`,
      });
    }

    if (!carId) {
      return response.status(400).send({
        message: 'invalid request body',
      });
    }

    if (!existedUser.favorites.includes(carId)) {
      existedUser.favorites.push(carId);
      const user = await existedUser.save();

      return response.send(user);
    } else {
      existedUser.favorites = existedUser.favorites.filter((fav) => fav != carId);
      const user = await existedUser.save();

      return response.send(user);
    }
  } catch (error) {
    console.error(error);

    return response.status(500).send({
      message: 'an error occurred on the server side while updating the user',
      carId,
      user: request.user,
    });
  }
};
