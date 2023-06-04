import express from 'express';

import verification from '@/middleware/verification.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verification);

export default router;
