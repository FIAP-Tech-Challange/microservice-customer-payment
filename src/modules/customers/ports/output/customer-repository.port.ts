import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerModel } from '../../models/domain/customer.model';
import { CustomerRequestParamsDto } from '../../models/dto/customer-request-params.dto';
import { CustomerPaginationDto } from '../../models/dto/customer-pagination.dto';

export interface CustomerRepositoryPort {
  findByCpf(cpf: CPF): Promise<CustomerModel | null>;
  create(customer: CustomerModel): Promise<void>;
  findById(id: string): Promise<CustomerModel | null>;
  findAll(params: CustomerRequestParamsDto): Promise<CustomerPaginationDto>;
}
