import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import chalk from 'chalk';

import checkFullnessDB from './helpers/checkFullnessDB';
import routes from './routes';

const PORT = config.get('port') ?? 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes); // base url

const start = async () => {
  try {
    mongoose.connection.once('open', () => {
      checkFullnessDB();
    });
    await mongoose.connect(config.get('mongoUri'));
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
