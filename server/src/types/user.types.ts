import { Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  isModerator?: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  favorites: string[];
}
