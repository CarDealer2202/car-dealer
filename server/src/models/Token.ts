import { model, Schema } from 'mongoose';

import { IToken } from '@/types/token.types';

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IToken>('Token', tokenSchema);
