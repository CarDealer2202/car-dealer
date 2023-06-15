import express from 'express';

import { updateUser } from '@/controllers/users.controllers';
import authentication from '@/middleware/authentication.middleware';

const router = express.Router();

router.patch('/', authentication, updateUser);

export default router;
