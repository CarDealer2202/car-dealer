import Car from '@/models/Car';
import { ICar } from '@/types/car.types';

interface Query {
  // brand?: { $regex: RegExp };
  brand?: { $in: RegExp[] };
  model?: { $regex: RegExp };
}

interface getAllCarsWithPaginationArg {
  brand: string;
  model: string;
  sort: string;
  orderValue: 1 | -1;
  limit: number;
  page: number;
}

const getAllCarsWithPagination = async ({
  brand,
  model,
  sort,
  orderValue,
  limit,
  page,
}: getAllCarsWithPaginationArg): Promise<[ICar[], number]> => {
  const query: Query = {};
  if (brand) {
    const brands = (brand as string).split(',');
    query.brand = { $in: brands.map((brand) => new RegExp(`^${brand}$`, 'i')) }; // строго марка должна совпадать, но регистр не важен
  } else if (model) {
    query.model = { $regex: new RegExp(`${model}`, 'i') };
  }
  const cars = await Car.find(query)
    .sort({ [sort as string]: orderValue })
    .limit(+limit * 1)
    .skip((+page - 1) * +limit)
    .exec();

  const count = await Car.countDocuments();

  return [cars, count];
};

export default getAllCarsWithPagination;
