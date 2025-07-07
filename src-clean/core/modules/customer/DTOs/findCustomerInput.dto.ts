export interface FindCustomerByIdInputDTO {
  id: string;
}

export interface FindCustomerByCpfInputDTO {
  cpf: string;
}

export interface FindAllCustomersInputDTO {
  page?: number;
  limit?: number;
  cpf?: string;
  name?: string;
}
