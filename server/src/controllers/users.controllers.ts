import { Request, Response } from 'express';

import User from '@/models/User';
import { ICar } from '@/types/car.types';

export const updateUser = async (request: Request, response: Response): Promise<Response> => {
  const { carId } = request.body;
  try {
    const existedUser = await User.findOne({ _id: request.user._id })
      .select('-password')
      .populate('favorites');

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

    const favoritesCars = existedUser.favorites as ICar[];
    const carExists = favoritesCars.find((car) => car._id == carId);

    if (!carExists) {
      existedUser.favorites.push(carId);
      const user = await existedUser.save();

      return response.send(user);
    } else {
      existedUser.favorites = existedUser.favorites.filter((fav) => {
        return fav._id != carId;
      });
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

export const getUser = async (request: Request, response: Response): Promise<Response> => {
  try {
    const existedUser = await User.findOne({ _id: request.user._id })
      .select('-password')
      .populate('favorites');

    if (existedUser) {
      return response.send(existedUser);
    } else {
      return response.status(404).send({
        message: 'user not found',
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
};


export const getEmail = async (request: Request, response: Response): Promise<Response> => {
  try {
    const existedUser = await User.findOne({ _id: request.body.id })
    .select('-password')
      .populate('favorites');
    if (existedUser) {
      return response.send({email: existedUser.email});
    } else {
      return response.status(404).send({
        message: 'user not found',
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).send(error);
  }
};
