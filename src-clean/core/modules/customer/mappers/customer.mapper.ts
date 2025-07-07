import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Customer } from '../entities/customer.entity';
import { CustomerDTO } from '../DTOs/customer.dto';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';

export class CustomerMapper {
  static toDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id,
      cpf: customer.cpf.toString(),
      name: customer.name,
      email: customer.email.toString(),
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  static toEntity(dto: CustomerDTO): CoreResponse<Customer> {
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
      cpf: cpf!,
      name: dto.name,
      email: email!,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    return Customer.fromProps(customerProps);
  }
}
