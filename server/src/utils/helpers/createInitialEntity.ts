import { Model } from 'mongoose';

async function createInitialEntity<T, S>(Model: Model<T>, data: S) {
  await Model.collection.drop();

  if (data instanceof Array) {
    return Promise.all(
      data.map(async (item) => {
        try {
          const { _id, ...newItem } = item;
          // console.log(item);
          const model = new Model(newItem);
          await model.save();
          return model;
        } catch (error) {
          return error;
        }
      })
    );
  }
}

export default createInitialEntity;
