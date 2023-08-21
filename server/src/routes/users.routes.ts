import express from 'express';

import { getUser, getEmail, updateUser } from '@/controllers/users.controllers';
import authentication from '@/middleware/authentication.middleware';

const router = express.Router();

router.patch('/', authentication, updateUser);
router.get('/', authentication, getUser);
router.patch('/email', authentication, getEmail);

export default router;
