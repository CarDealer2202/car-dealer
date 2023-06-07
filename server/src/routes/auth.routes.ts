import express from 'express';

import {
  googleAuth,
  googleCallback,
  loginUser,
  registerUser,
  updateTokens,
} from '@/controllers/auth.controllers';
import { loginValidator, registerValidator } from '@/utils/validators/auth.validators';

const router = express.Router({ mergeParams: true });

router.post('/signUp', registerValidator, registerUser);
router.post('/signIn', loginValidator, loginUser);
router.post('/me', updateTokens);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
