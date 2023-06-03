import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import Token from '@/models/Token';

interface GenerateTokensPayload {
  _id: Types.ObjectId | null;
}

const accessKey = process.env.ACCESS_KEY ?? 'key';
const refreshKey = process.env.REFRESH_KEY ?? 'key';
const expiresIn = process.env.EXPIRES_IN ?? 86400;

class TokenService {
  public generateTokens(payload: GenerateTokensPayload) {
    const accessToken = jwt.sign(payload, accessKey, { expiresIn });
    const refreshToken = jwt.sign(payload, refreshKey);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async save(userId: Types.ObjectId, refreshToken: string) {
    const foundToken = await Token.findOne({ userId });

    if (foundToken) {
      foundToken.refreshToken = refreshToken;
      return foundToken.save();
    }

    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  validateRefresh(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, refreshKey);
    } catch (error) {
      return null;
    }
  }

  validateAccess(accessToken: string) {
    try {
      return jwt.verify(accessToken, accessKey);
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    try {
      return await Token.findOne({ refreshToken });
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
