import { CustomerModel } from '../../models/domain/customer.model';

export interface CustomerRepositoryPort {
  findByCpf(cpf: string): Promise<CustomerModel | null>;
  create(customer: CustomerModel): Promise<void>;
}
