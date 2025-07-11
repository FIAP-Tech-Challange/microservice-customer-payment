export interface FindAllCustomersInputDTO {
  cpf?: string;
  name?: string;
  email?: string;
  page: number;
  size: number;
}
