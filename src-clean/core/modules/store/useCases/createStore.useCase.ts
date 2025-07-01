import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CreateStoreInputDTO } from '../DTOs/createStoreInput.dto';
import { StoreGateway } from '../gateways/store.gateway';
import { Store } from '../entities/store.entity';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';
import { CoreException } from 'src-clean/common/exceptions/coreException';

export class CreateStoreUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(dto: CreateStoreInputDTO): Promise<CoreResponse<Store>> {
    let email: Email;
    let cnpj: CNPJ;
    let phone: BrazilianPhone;

    try {
      email = new Email(dto.email);
      cnpj = new CNPJ(dto.cnpj);
      phone = new BrazilianPhone(dto.phone);
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }

    const { error: createErr, value: store } = Store.create({
      name: dto.name,
      fantasyName: dto.fantasyName,
      email,
      cnpj,
      plainPassword: dto.plainPassword,
      phone,
    });
    if (createErr) return { error: createErr, value: undefined };

    const { error: findErr, value: existingStoreEmail } =
      await this.storeGateway.findStoreByEmail(dto.email);
    if (findErr) return { error: findErr, value: undefined };
    if (existingStoreEmail) {
      return {
        error: new ResourceConflictException(
          'Store with this email already exists',
        ),
        value: undefined,
      };
    }

    const { error: findErrCnpj, value: existingStoreCnpj } =
      await this.storeGateway.findStoreByCnpj(dto.cnpj);
    if (findErrCnpj) return { error: findErrCnpj, value: undefined };
    if (existingStoreCnpj) {
      return {
        error: new ResourceConflictException(
          'Store with this CNPJ already exists',
        ),
        value: undefined,
      };
    }

    const { error: findErrName, value: existingStoreName } =
      await this.storeGateway.findStoreByName(dto.name);
    if (findErrName) return { error: findErrName, value: undefined };
    if (existingStoreName) {
      return {
        error: new ResourceConflictException(
          'Store with this name already exists',
        ),
        value: undefined,
      };
    }

    const { error: saveErr } = await this.storeGateway.saveStore(store);
    if (saveErr) return { error: saveErr, value: undefined };

    return { error: undefined, value: store };
  }
}
