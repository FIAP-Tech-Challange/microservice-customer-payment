import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ValidateStorePasswordInputDTO } from '../DTOs/validateStorePasswordInput.dto';
import { StoreGateway } from '../gateways/store.gateway';
import { FindStoreByEmailUseCase } from './findStoreByEmail.useCase';

export class ValidateStorePasswordUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(
    dto: ValidateStorePasswordInputDTO,
  ): Promise<CoreResponse<boolean>> {
    const findStoreUseCase = new FindStoreByEmailUseCase(this.storeGateway);

    const [err, store] = await findStoreUseCase.execute(dto.email);
    if (err) return [err, undefined];

    return [undefined, store.verifyPassword(dto.password)];
  }
}
