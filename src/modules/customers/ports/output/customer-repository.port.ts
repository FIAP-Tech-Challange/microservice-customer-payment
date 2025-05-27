import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerModel } from '../../models/domain/customer.model';

export interface CustomerRepositoryPort {
  findByCpf(cpf: CPF): Promise<CustomerModel | null>;
  create(customer: CustomerModel): Promise<void>;
}
