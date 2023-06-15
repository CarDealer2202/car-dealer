import { Document } from 'mongoose';

import { ICar } from './car.types';
import { IUser } from './user.types';

export interface IOrder extends Document {
  userId: IUser['_id'];
  cars: ICar['_id'][];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'accepted' | 'completed';
}
