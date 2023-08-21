import { IUser } from '@/types/user.types';

type ResponseUser = Pick<IUser, 'name' | 'email' | 'isModerator' | 'createdAt' | 'updatedAt'>;

const createResponseUser = (user: IUser | null): ResponseUser | null => {
  if (user) {
    const { name, email, isModerator, createdAt, updatedAt } = user;
    
    return {
      name,
      email,
      isModerator,
      createdAt,
      updatedAt,
    };
  } else return null;
};

export default createResponseUser;
