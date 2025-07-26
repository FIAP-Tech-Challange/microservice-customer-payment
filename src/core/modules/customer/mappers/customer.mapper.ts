import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Customer } from '../entities/customer.entity';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';

export class CustomerMapper {
  static toDTO(customer: Customer): CustomerDataSourceDTO {
    return {
      id: customer.id,
      cpf: customer.cpf.toString(),
      name: customer.name,
      email: customer.email.toString(),
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: CustomerDataSourceDTO): CoreResponse<Customer> {
    const { error: cpfError, value: cpf } = CPF.create(dto.cpf);
    if (cpfError) {
      return { error: cpfError, value: undefined };
    }

    const { error: emailError, value: email } = Email.create(dto.email);
    if (emailError) {
      return { error: emailError, value: undefined };
    }

    const customerProps = {
      id: dto.id,
      cpf,
      name: dto.name,
      email,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };

    return Customer.restore(customerProps);
  }
}
