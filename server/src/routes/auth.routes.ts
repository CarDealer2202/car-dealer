import express from 'express';

import { registerUser } from '@/controllers/auth.controller';

const router = express();

router.post('/signUp', registerUser);

export default router;
