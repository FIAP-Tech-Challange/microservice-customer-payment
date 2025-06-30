import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreGateway } from '../gateways/store.gateway';
import { ValidateStorePasswordInputDTO } from '../DTOs/validateStorePasswordInput.dto';
import { ValidateStorePasswordUseCase } from '../useCases/validateStorePassword.useCase';
import { StoreDTO } from '../DTOs/store.dto';
import { FindStoreByEmailUseCase } from '../useCases/findStoreByEmail.useCase';
import { StorePresenter } from '../presenters/store.presenter';

export class StoreCoreController {
  constructor(private dataSource: DataSource) {}

  async validateStorePassword(
    dto: ValidateStorePasswordInputDTO,
  ): Promise<boolean> {
    const gateway = new StoreGateway(this.dataSource);
    const useCase = new ValidateStorePasswordUseCase(gateway);

    const isValid = await useCase.execute({
      email: dto.email,
      password: dto.password,
    });

    return isValid;
  }

  async findStoreByEmail(email: string): Promise<StoreDTO> {
    const gateway = new StoreGateway(this.dataSource);
    const useCase = new FindStoreByEmailUseCase(gateway);
    const store = await useCase.execute(email);

    return StorePresenter.toDto(store);
  }
}
