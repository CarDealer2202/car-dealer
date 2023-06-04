import { model, Schema } from 'mongoose';

import { IOrder } from '@/types/order.types';

const orderSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cars: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Car',
      },
    ],
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>('Order', orderSchema);
