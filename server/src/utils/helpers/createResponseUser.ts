import { IUser } from '@/types/user.types';

type ResponseUser = Pick<IUser, 'name' | 'email' | 'createdAt' | 'updatedAt'>;

const createResponseUser = (user: IUser | null): ResponseUser | null => {
  if (user) {
    const { name, email, createdAt, updatedAt } = user;

    return {
      name,
      email,
      createdAt,
      updatedAt,
    };
  } else return null;
};

export default createResponseUser;
