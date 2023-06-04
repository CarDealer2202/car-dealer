import { check } from 'express-validator';

export const registerValidator = [
  check('email', 'invalid email').trim().isEmail(),
  check('name', 'the minimum name length must be 2 characters').trim().isLength({ min: 2 }),
  check('password', 'the minimum password length must be 8 characters')
    .trim()
    .isLength({ min: 8 }),
];
