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
    isModerator:{
      type: Boolean,
      default: false
    },
    password: {
      type: String,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
