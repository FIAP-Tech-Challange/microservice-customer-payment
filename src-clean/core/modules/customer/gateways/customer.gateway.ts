import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Customer } from '../entities/customer.entity';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';

export class CustomerGateway {
  constructor(private dataSource: DataSource) {}

  private fromDataSourceDTO(
    dataSourceDTO: CustomerDataSourceDTO,
  ): CoreResponse<Customer> {
    const { error: cpfError, value: cpf } = CPF.create(dataSourceDTO.cpf);
    if (cpfError) {
      return { error: cpfError, value: undefined };
    }

    const { error: emailError, value: email } = Email.create(
      dataSourceDTO.email,
    );
    if (emailError) {
      return { error: emailError, value: undefined };
    }

    const customerProps = {
      id: dataSourceDTO.id,
      cpf,
      name: dataSourceDTO.name,
      email,
      createdAt: dataSourceDTO.createdAt,
      updatedAt: dataSourceDTO.updatedAt,
    };

    return Customer.restore(customerProps);
  }

  private toDataSourceDTO(customer: Customer): CustomerDataSourceDTO {
    return {
      id: customer.id,
      cpf: customer.cpf.toString(),
      name: customer.name,
      email: customer.email.toString(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async findCustomerById(id: string): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerById(id);
    if (!customerDataSourceDTO) return { error: undefined, value: null };

    return this.fromDataSourceDTO(customerDataSourceDTO);
  }

  async findCustomerByCpf(cpf: string): Promise<CoreResponse<Customer | null>> {
    const customerDataSourceDTO = await this.dataSource.findCustomerByCpf(cpf);
    if (!customerDataSourceDTO) return { error: undefined, value: null };

    return this.fromDataSourceDTO(customerDataSourceDTO);
  }

  async findAllCustomers(
    params: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<Customer[]>> {
    const customersDataSourceDTO =
      await this.dataSource.findCustomersForUseCase(params);

    if (!customersDataSourceDTO || customersDataSourceDTO.length === 0) {
      return { error: undefined, value: [] };
    }

    const customers: Customer[] = [];

    for (const customerDataSourceDTO of customersDataSourceDTO) {
      const customerEntityResult = this.fromDataSourceDTO(
        customerDataSourceDTO,
      );

      if (customerEntityResult.error) {
        return { error: customerEntityResult.error, value: undefined };
      }

      customers.push(customerEntityResult.value);
    }

    return { error: undefined, value: customers };
  }

  async saveCustomer(customer: Customer): Promise<CoreResponse<Customer>> {
    const customerDataSourceDTO = this.toDataSourceDTO(customer);
    await this.dataSource.saveCustomer(customerDataSourceDTO);

    return { error: undefined, value: customer };
  }

  async updateCustomer(customer: Customer): Promise<CoreResponse<Customer>> {
    const customerDataSourceDTO = this.toDataSourceDTO(customer);
    await this.dataSource.updateCustomer(customerDataSourceDTO);

    return { error: undefined, value: customer };
  }

  async deleteCustomer(customer: Customer): Promise<CoreResponse<void>> {
    await this.dataSource.deleteCustomer(customer.id);
    return { error: undefined, value: undefined };
  }
}
