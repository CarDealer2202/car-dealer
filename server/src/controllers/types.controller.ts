import { Request, Response } from 'express';

import Type from '@/models/Type';

export const getAllTypes = async (request: Request, response: Response) => {
  try {
    const types = await Type.find();
    response.status(200).send(types);
  } catch (error) {
    response.status(500).json({
      message: 'An error occurred while getting machines on the server',
    });
  }
};
