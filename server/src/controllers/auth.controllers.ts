import axios from 'axios';
import bcrypt from 'bcryptjs';
import env from 'dotenv';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';

import User from '@/models/User';
import tokenService from '@/services/token.service';
import createResponseUser from '@/utils/helpers/createResponseUser';
import isTokenInvalid from '@/utils/helpers/isTokenInvalid';

env.config();

// /google
const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const redirectUri = process.env.GOOGLE_REDIRECT ?? '';

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

      const responseUser = createResponseUser(newUser);

      return response.status(201).send({ ...tokens, user: responseUser });
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
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        message: 'invalid data',
        details: errors.array(),
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return response.status(401).send({
        message: 'email not found',
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, existingUser.password as string);

    if (!isPasswordEqual) {
      return response.status(401).send({
        message: 'invalid password',
      });
    }

    const tokens = tokenService.generateTokens({ _id: existingUser._id });
    await tokenService.save(existingUser._id, tokens.refreshToken);

    const responseUser = createResponseUser(existingUser);

    return response.status(200).send({
      ...tokens,
      user: responseUser,
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

export const updateTokens = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { refreshToken } = request.body;
    const data = tokenService.validateRefresh(refreshToken) as JwtPayload | null; // ? как тут возможна строка идк
    const dbToken = await tokenService.findToken(refreshToken);

    if (isTokenInvalid(data, dbToken)) {
      return response.status(401).json({
        message: 'unauthorized',
      });
    }

    const tokens = await tokenService.generateTokens({
      _id: data?._id,
    });
    await tokenService.save(data?._id, tokens.refreshToken);

    const existedUser = await User.findOne({ _id: data?._id });

    const responseUser = createResponseUser(existedUser);

    return response.status(200).send({ ...tokens, user: responseUser });
  } catch (error) {
    return response.status(500).json({
      message: `an error occurred on the server: ${error}`,
    });
  }
};

export const googleAuth = (request: Request, response: Response): void => {
  const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

  response.redirect(authURL);
};

export const googleCallback = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { code } = request.query;

  try {
    // обмен кода авторизации на токен доступа
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // проверка токена доступа на валидность
    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
    );

    // создание JWT токена на основе полученных данных
    const { email, name } = userInfoResponse.data;

    const existedUser = await User.findOne({ email });

    let tokens;

    if (!existedUser) {
      // если пользователя нет - мы создаем его в базе и создаем токены
      const newUser = await User.create({
        email,
        name,
      });

      tokens = tokenService.generateTokens({ _id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);

      const responseUser = createResponseUser(newUser);

      const script = `
      <script>
        const data = ${JSON.stringify({ ...tokens, user: responseUser })};
        window.opener.postMessage(data, 'http://localhost:3000');
        window.close();
      </script>
      `;

      return response.status(201).send(script);
    } else {
      // если пользователь есть - мы берем его id и создаем токены
      tokens = tokenService.generateTokens({ _id: existedUser._id });
      await tokenService.save(existedUser._id, tokens.refreshToken);

      const responseUser = createResponseUser(existedUser);

      const script = `
      <script>
        const data = ${JSON.stringify({ ...tokens, user: responseUser })};
        window.opener.postMessage(data, 'http://localhost:3000');
        window.close();
      </script>
      `;

      return response.status(201).send(script);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).send({ message: "can't login with this account" });
  }
};
