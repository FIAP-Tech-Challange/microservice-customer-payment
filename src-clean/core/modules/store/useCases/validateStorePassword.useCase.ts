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

    const { error: err, value: store } = await findStoreUseCase.execute(
      dto.email,
    );
    if (err) return { error: err, value: undefined };

    return { error: undefined, value: store.verifyPassword(dto.password) };
  }
}
