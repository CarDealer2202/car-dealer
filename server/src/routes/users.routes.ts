import express from 'express';

import { getUser, updateUser } from '@/controllers/users.controllers';
import authentication from '@/middleware/authentication.middleware';

const router = express.Router();

router.patch('/', authentication, updateUser);
router.get('/', authentication, getUser);

export default router;
