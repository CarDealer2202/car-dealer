import { Document, Schema, Model, model } from 'mongoose';

import { IType } from '@/types/type.types';

export interface TypeModel extends Omit<IType, '_id'>, Document {}

const typeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Type: Model<TypeModel> = model<TypeModel>('Type', typeSchema);

export default Type;
