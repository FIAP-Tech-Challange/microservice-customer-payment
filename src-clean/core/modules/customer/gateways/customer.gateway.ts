import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Customer } from '../entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CustomerDataSourceMapper } from '../mappers/customerDataSource.mapper';
import { CustomerPaginationDTO } from '../DTOs/customerPagination.dto';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';


export class CustomerGateway {
  constructor(private dataSource: DataSource) {}

  async findCustomerById(id: string): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerById(id);
    if (!customerDataSourceDTO) return { error: undefined, value: null };

    const customerDTO = CustomerDataSourceMapper.toCustomerDTO(customerDataSourceDTO);
    const customerEntity = CustomerMapper.toEntity(customerDTO);
    return customerEntity;
  }

  async findCustomerByCpf(cpf: string): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerByCpf(cpf);
    if (!customerDataSourceDTO) return { error: undefined, value: null };

    const customerDTO = CustomerDataSourceMapper.toCustomerDTO(customerDataSourceDTO);
    const customerEntity = CustomerMapper.toEntity(customerDTO);
    return customerEntity;
  }

  async findAllCustomers(params: FindAllCustomersInputDTO): Promise<CoreResponse<CustomerPaginationDTO>> {
    const paginationDataSourceDTO = await this.dataSource.findAllCustomers(params);
    const paginationDTO = CustomerDataSourceMapper.toCustomerPaginationDTO(paginationDataSourceDTO);
    
    return { error: undefined, value: paginationDTO };
  }

  async saveCustomer(customer: Customer): Promise<CoreResponse<Customer>> {
    const customerDTO = CustomerMapper.toDTO(customer);
    const customerDataSourceDTO = CustomerDataSourceMapper.toCustomerDataSourceDTO(customerDTO);
    const savedCustomerDataSourceDTO = await this.dataSource.saveCustomer(customerDataSourceDTO);
    
    const savedCustomerDTO = CustomerDataSourceMapper.toCustomerDTO(savedCustomerDataSourceDTO);
    const customerEntity = CustomerMapper.toEntity(savedCustomerDTO);
    return customerEntity;
  }

  async updateCustomer(customer: Customer): Promise<CoreResponse<Customer>> {
    const customerDTO = CustomerMapper.toDTO(customer);
    const customerDataSourceDTO = CustomerDataSourceMapper.toCustomerDataSourceDTO(customerDTO);
    const updatedCustomerDataSourceDTO = await this.dataSource.updateCustomer(customerDataSourceDTO);
    
    const updatedCustomerDTO = CustomerDataSourceMapper.toCustomerDTO(updatedCustomerDataSourceDTO);
    const customerEntity = CustomerMapper.toEntity(updatedCustomerDTO);
    return customerEntity;
  }

  async deleteCustomer(id: string): Promise<CoreResponse<boolean>> {
    const result = await this.dataSource.deleteCustomer(id);
    return { error: undefined, value: result };
  }
}
