import { Document, Schema, Model, model } from 'mongoose';
import { ICar } from '../types/car.type';

export interface CarModel extends Omit<ICar, '_id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const carSchema: Schema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: [String],
    desc: String,
    type: {
      type: Schema.Types.ObjectId,
      ref: 'Type',
    },
    horsepower: {
      type: Number,
      required: true,
    },
    max_speed: {
      type: Number,
      required: true,
    },
    acceleration_to_100: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car: Model<CarModel> = model<CarModel>('Car', carSchema);

export default Car;
