import { JwtPayload } from 'jsonwebtoken';

import { IToken } from '@/types/token.types';

const isTokenInvalid = (data: JwtPayload | null, dbToken: IToken | null): boolean =>
  !data || !dbToken || data._id !== dbToken?.userId?.toString();

export default isTokenInvalid;
