import { model, Schema } from 'mongoose';

import { IUser } from '@/types/user.types';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    favorites: [
      {
        carId: { type: Schema.Types.ObjectId, ref: 'Car' },
        _id: false, // это для отключения автоматической генерации идентификатора
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
