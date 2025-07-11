export interface CustomerResponseDTO {
  id: string;
  cpf: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerListResponseDTO {
  customers: CustomerResponseDTO[];
}

export interface CustomerPaginationResponseDTO {
  data: CustomerResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
