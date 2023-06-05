import Order from '@/models/Order';
import { ICar } from '@/types/car.types';

const getTopCarSales = async (orderValue: 1 | -1, limit: number): Promise<ICar[]> => {
  const currentDate = new Date();

  // Вычисляем дату, которая находится 6 месяцев назад от текущей даты
  const sixMonthsAgoDate = new Date();
  // sixMonthsAgoDate.setHours(sixMonthsAgoDate.getHours() - 1); // для теста, чтоб выводило все заказы сделанные в течении часа
  sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

  const topCars = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgoDate, $lte: currentDate } } }, // Фильтрация заказов по дате создания
    { $unwind: '$cars' }, // Развернуть массив cars в отдельные документы
    { $group: { _id: '$cars', totalOrders: { $sum: 1 } } }, // Группировка по cars и подсчет общего количества заказов
    { $sort: { totalOrders: orderValue } }, // Сортировка количества заказов
    { $limit: +limit }, // Ограничение результатов
    { $lookup: { from: 'cars', localField: '_id', foreignField: '_id', as: 'car' } }, // Объединение с коллекцией cars, что возвращались как итог массив обьектов машин
    { $unwind: '$car' }, // Развернуть массив car в отдельные документы
    { $replaceRoot: { newRoot: '$car' } }, // Заменяем корневой документ на поле 'car'
  ]);

  return topCars;
};

export default getTopCarSales;
