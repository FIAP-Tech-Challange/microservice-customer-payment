import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ValidateStorePasswordInputDTO } from '../DTOs/validateStorePasswordInput.dto';
import { FindStoreByEmailUseCase } from './findStoreByEmail.useCase';

export class ValidateStorePasswordUseCase {
  constructor(private findStoreByEmailUseCase: FindStoreByEmailUseCase) {}

  async execute(
    dto: ValidateStorePasswordInputDTO,
  ): Promise<CoreResponse<boolean>> {
    const findStore = await this.findStoreByEmailUseCase.execute(dto.email);
    if (findStore.error) return { error: findStore.error, value: undefined };

    return {
      error: undefined,
      value: findStore.value.verifyPassword(dto.password),
    };
  }
}
