import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import env from 'dotenv';
import cors from 'cors';

import checkFullnessDB from '@/utils/helpers/checkFullnessDB';
import routes from '@/routes/index';

env.config();

const PORT = process.env.PORT ?? 8080;
const databaseURL = process.env.DATABASE_URL ?? '';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes); // base url

const start = async () => {
  try {
    mongoose.connection.once('open', () => {
      checkFullnessDB();
    });
    await mongoose.connect(databaseURL);
    console.log(chalk.cyanBright(`MongoDB connected`));
    app.listen(PORT, () =>
      console.log(chalk.cyanBright(`server has been started on port ${PORT}`))
    );
  } catch (error) {
    if (error instanceof Error) console.log(chalk.redBright(error.message));
    else console.log(chalk.redBright(error));
    process.exit(1);
  }
};

start();
