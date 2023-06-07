import express from 'express';

import { getAllTypes } from '@/controllers/types.controllers';

const router = express.Router({ mergeParams: true });

router.get('/', getAllTypes);

export default router;
