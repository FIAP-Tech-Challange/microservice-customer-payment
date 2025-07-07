export interface CustomerDataSourceDTO {
  id: string;
  cpf: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerPaginationDataSourceDTO {
  customers: CustomerDataSourceDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FindAllCustomersParamsDTO {
  page?: number;
  limit?: number;
  cpf?: string;
  name?: string;
}
