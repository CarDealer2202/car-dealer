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
    status: String,
    totalPrice: Number,
  },
  // я как пользователь на странице корзины могу менять количество авто (дизайн без разницы)
  // фикс ренжы цены
  // я как авторизованный пользователь, хочу иемть возможность добавлять с списка авто у мой собственный список желаемых (возле каждой авто в списке)
  {
    timestamps: true,
  }
);

export default model<IOrder>('Order', orderSchema);
