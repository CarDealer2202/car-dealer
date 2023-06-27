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
        carId: { type: Schema.Types.ObjectId, ref: 'Car' },
        color: String,
        _id: false, // это для отключения автоматической генерации идентификатора
      },
    ],
    status: {
      type: String,
      default: 'accepted',
    },
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>('Order', orderSchema);
