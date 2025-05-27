import { CustomerModel } from '../../models/domain/customer.model';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';

export interface CustomerInputPort {
  findByCpf(cpf: string): Promise<CustomerModel>;
  create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel>;
  findById(id: string): Promise<CustomerModel>;
  findAll(): Promise<CustomerModel[]>;
}
