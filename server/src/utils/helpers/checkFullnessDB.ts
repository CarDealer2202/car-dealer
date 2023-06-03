import createInitialEntity from './createInitialEntity';
import Car, { CarModel } from '@/models/Car';
import Type, { TypeModel } from '@/models/Type';
import carsMock from '@/db/mocks/Cars.json';
import typesMock from '@/db/mocks/Types.json';
import { ICar } from '@/types/car.type';
import { IType } from '@/types/type.type';

const fillingDB = async () => {
  const cars = await Car.find();
  if (cars.length !== carsMock.length) {
    await createInitialEntity<CarModel, ICar[]>(Car, carsMock);
  }

  const types = await Type.find();
  if (types.length !== typesMock.length) {
    await createInitialEntity<TypeModel, IType[]>(Type, typesMock);
  }
};

export default fillingDB;
