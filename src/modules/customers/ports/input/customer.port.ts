import { CustomerModel } from '../../models/customer.model';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';

export interface CustomerInputPort {
  findByCpf(cpf: string): Promise<CustomerModel>;
  create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel>;
}
