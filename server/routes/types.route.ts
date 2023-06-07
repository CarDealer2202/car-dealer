import express from 'express';

import Type from '../models/Type.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (request, response) => {
  try {
    const types = await Type.find();
    response.status(200).send(types);
  } catch (error) {
    response.status(500).json({
      message: 'An error occurred while getting machines on the server',
    });
  }
});

export default router;
