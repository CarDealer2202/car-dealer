import { IType } from './type.type';

export interface ICar {
  _id: string;
  img: string;
  brand: string;
  model: string;
  color: string[];
  desc?: string;
  type: IType['_id'];
  horsepower: number;
  max_speed: number;
  acceleration_to_100: number;
  price: number;
}

export const isCarArray = (data: unknown): data is ICar[] => {
  return Boolean(
    data && data instanceof Array && data[0] instanceof Object && '_id' in data[0]
  );
};
