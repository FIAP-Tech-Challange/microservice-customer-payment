import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { GeneralDataSource } from './general/general.dataSource';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';


export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
  ) {}

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerById(id);
  }
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerByCpf(cpf);
  }
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerByEmail(email);
  }
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    return this.generalDataSource.findAllCustomers(paginatedParams, filters);
  }
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveCustomer(customer);
  }

}
