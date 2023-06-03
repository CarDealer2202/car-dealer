import { Document } from 'mongoose';

import { IUser } from './user.types';

export interface IToken extends Document {
  userId: IUser['_id'];
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
