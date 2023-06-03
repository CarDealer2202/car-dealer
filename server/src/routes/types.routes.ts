import express from 'express';

import { getAllTypes } from '@/controllers/types.controller';

const router = express.Router({ mergeParams: true });

router.get('/', getAllTypes);

export default router;
