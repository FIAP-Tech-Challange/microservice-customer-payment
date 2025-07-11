export interface FindCustomerByIdInputDTO {
  id: string;
}

export interface FindCustomerByCpfInputDTO {
  cpf: string;
}

export interface FindAllCustomersInputDTO {
  cpf?: string;
  name?: string;
  email?: string;
  page?: number;
  size?: number;
}
