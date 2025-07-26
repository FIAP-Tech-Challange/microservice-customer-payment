import { Request } from 'express';

export interface RequestFromStore extends Request {
  storeId: string;
}

export interface RequestFromTotem extends Request {
  storeId: string;
  totemAccessToken: string;
  totemId: string;
}

export interface RequestFromStoreOrTotem extends Request {
  storeId: string;
  totemAccessToken: string;
  totemId: string;
}
