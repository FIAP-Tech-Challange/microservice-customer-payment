import { Request } from 'express';

export interface RequestWithStoreId extends Request {
  storeId: string;
}
