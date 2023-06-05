import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import tokenService from '@/services/token.service';

const verificationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void | Response => {
  if (request.method === 'OPTIONS') {
    // системный запрос, чисто для проверки доступности сервера
    return next();
  }

  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return response.status(401).json({
        message: 'unauthorized access',
      });
    }

    const data = tokenService.validateAccess(token) as JwtPayload | null; // ОТКУДА ТУТ МОЖЕТ БЫТЬ СТРОКА, Я НЕ ПОНИМАЮ
    if (data && data.exp && data?.exp > Math.floor(Date.now() / 1000)) {
      request.user = data;
      return next();
    } else {
      return response.status(401).json({
        message: 'unauthorized access',
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: 'an error occurred on the server while processing the token',
    });
  }
};

export default verificationMiddleware;
