import { CustomerModel } from '../../models/domain/customer.model';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';
import { CustomerPaginationDto } from '../../models/dto/customer-pagination.dto';
import { CustomerRequestParamsDto } from '../../models/dto/customer-request-params.dto';

export interface CustomerInputPort {
  findAll(params: CustomerRequestParamsDto): Promise<CustomerPaginationDto>;
  findByCpf(cpf: string): Promise<CustomerModel>;
  findById(id: string): Promise<CustomerModel>;
  create(createCustomerDto: CreateCustomerDto): Promise<CustomerModel>;
}
