import express from 'express';

import { loginUser, registerUser } from '@/controllers/auth.controller';
import { loginValidator, registerValidator } from '@/utils/validators/auth.validators';

const router = express.Router({ mergeParams: true });

router.post('/signUp', registerValidator, registerUser);
router.post('/signIn', loginValidator, loginUser);

export default router;
