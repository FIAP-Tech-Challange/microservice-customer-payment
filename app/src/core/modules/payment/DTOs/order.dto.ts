export interface OrderDTO {
  id: string;
  storeId: string;
  status: string;
  [key: string]: unknown;
}
