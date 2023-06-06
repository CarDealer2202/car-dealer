import { ObjectId } from 'mongoose';

import Car from '@/models/Car';
import { ICar } from '@/types/car.types';

interface Query {
  // brand?: { $regex: RegExp };
  brand?: { $in: RegExp[] };
  model?: { $regex: RegExp };
  price?: { $gte: number; $lte: number } | { $gte: number };
  ['type.name']?: { 'type.name': RegExp[] };
}

interface getAllCarsWithPaginationArg {
  brand: string;
  model: string;
  sort: string;
  orderValue: 1 | -1;
  limit: number;
  page: number;
  minPrice: number;
  maxPrice: undefined;
  type: string;
}

const getAllCarsWithPagination = async ({
  brand,
  model,
  sort,
  orderValue,
  limit,
  page,
  minPrice,
  maxPrice,
  type,
}: getAllCarsWithPaginationArg): Promise<[ICar[], number]> => {
  const query: Query = {};
  if (brand) {
    const brands = (brand as string).split(',');
    query.brand = { $in: brands.map((brand) => new RegExp(`^${brand}$`, 'i')) }; // строго марка должна совпадать, но регистр не важен
  }
  if (model) {
    query.model = { $regex: new RegExp(`${model}`, 'i') };
  }
  if (minPrice && maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  } else {
    query.price = { $gte: minPrice };
  }
  if (type) {
    // query.type = type;
    const types = (type as string).split(',');
    query.type = { $in: types };
  }
  const cars = await Car.find(query)
    .sort({ [sort as string]: orderValue })
    .limit(+limit * 1)
    .skip((+page - 1) * +limit)
    .exec();

  const count = await Car.countDocuments(query);

  return [cars, count];
};

export default getAllCarsWithPagination;
