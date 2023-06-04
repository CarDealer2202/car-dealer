import express from 'express';

import { registerUser } from '@/controllers/auth.controller';
import { registerValidator } from '@/utils/validators/auth.validators';

const router = express.Router({ mergeParams: true });

router.post('/signUp', registerValidator, registerUser);

export default router;
