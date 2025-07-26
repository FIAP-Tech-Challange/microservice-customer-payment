import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateStoreInputDTO } from '../DTOs/createStoreInput.dto';
import { StoreGateway } from '../gateways/store.gateway';
import { Store } from '../entities/store.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

export class CreateStoreUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(dto: CreateStoreInputDTO): Promise<CoreResponse<Store>> {
    const email = Email.create(dto.email);
    if (email.error) return { error: email.error, value: undefined };

    const cnpj = CNPJ.create(dto.cnpj);
    if (cnpj.error) return { error: cnpj.error, value: undefined };

    const phone = BrazilianPhone.create(dto.phone);
    if (phone.error) return { error: phone.error, value: undefined };

    const store = Store.create({
      name: dto.name,
      fantasyName: dto.fantasyName,
      email: email.value,
      cnpj: cnpj.value,
      plainPassword: dto.plainPassword,
      phone: phone.value,
    });
    if (store.error) return { error: store.error, value: undefined };

    const findByEmail = await this.storeGateway.findStoreByEmail(email.value);
    if (findByEmail.error) {
      return { error: findByEmail.error, value: undefined };
    }

    if (findByEmail.value) {
      return {
        error: new ResourceConflictException(
          'Store with this email already exists',
        ),
        value: undefined,
      };
    }

    const findByCnpj = await this.storeGateway.findStoreByCnpj(cnpj.value);
    if (findByCnpj.error) return { error: findByCnpj.error, value: undefined };
    if (findByCnpj.value) {
      return {
        error: new ResourceConflictException(
          'Store with this CNPJ already exists',
        ),
        value: undefined,
      };
    }

    const findByName = await this.storeGateway.findStoreByName(dto.name);
    if (findByName.error) return { error: findByName.error, value: undefined };
    if (findByName.value) {
      return {
        error: new ResourceConflictException(
          'Store with this name already exists',
        ),
        value: undefined,
      };
    }

    const saveStore = await this.storeGateway.saveStore(store.value);
    if (saveStore.error) return { error: saveStore.error, value: undefined };

    return { error: undefined, value: store.value };
  }
}
