import { ValidateStorePasswordInputDTO } from '../DTOs/validateStorePasswordInput.dto';
import { StoreGateway } from '../gateways/store.gateway';
import { FindStoreByEmailUseCase } from './findStoreByEmail.useCase';

export class ValidateStorePasswordUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(dto: ValidateStorePasswordInputDTO): Promise<boolean> {
    const findStoreUseCase = new FindStoreByEmailUseCase(this.storeGateway);

    const store = await findStoreUseCase.execute(dto.email);

    return store.verifyPassword(dto.password);
  }
}
