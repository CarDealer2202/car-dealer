import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '@/models/User';
import tokenService from '@/services/token.service';

export const registerUser = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { password, email } = request.body;

  try {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).send({
        message: 'invalid body request',
        details: errors.array(),
      });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return response.status(409).send({
        message: 'user with this email is already registered',
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        ...request.body,
        password: hashedPassword,
      });

      const tokens = tokenService.generateTokens({ _id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);

      return response.status(201).send({ ...tokens, userId: newUser._id });
    }
  } catch (error) {
    if (error instanceof Error) {
      return response.status(500).json({
        message: `failed to singUp, error text: ${error.message}`,
      });
    } else {
      return response.status(500).json({
        message: `failed to singUp, error text: ${error}`,
      });
    }
  }
};

export const loginUser = async (request: Request, response: Response): Promise<Response> => {
  const { email, password } = request.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return response.status(401).send({
        message: 'email not found',
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordEqual) {
      return response.status(401).send({
        message: 'invalid password',
      });
    }

    const tokens = tokenService.generateTokens({ _id: existingUser._id });
    await tokenService.save(existingUser._id, tokens.refreshToken);

    return response.status(200).send({
      ...tokens,
      userId: existingUser._id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return response.status(500).json({
        message: `failed to singIn, error text: ${error.message}`,
      });
    } else {
      return response.status(500).json({
        message: `failed to singIn, error text: ${error}`,
      });
    }
  }
};
