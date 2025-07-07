export interface CustomerPaginationDTO {
  customers: CustomerDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CustomerDTO {
  id: string;
  cpf: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
