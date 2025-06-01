import { CPF } from 'src/shared/domain/cpf.vo';
import { CustomerModel } from './domain/customer.model';
import { CustomerEntity } from './entities/customer.entity';
import { Email } from 'src/shared/domain/email.vo';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): CustomerModel {
    return CustomerModel.fromProps({
      id: entity.id,
      cpf: new CPF(entity.cpf),
      name: entity.name,
      email: new Email(entity.email),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toEntity(model: CustomerModel): CustomerEntity {
    return CustomerEntity.create({
      id: model.id,
      cpf: model.cpf.toString(),
      name: model.name,
      email: model.email.toString(),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
