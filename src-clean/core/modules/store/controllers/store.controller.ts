import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreGateway } from '../gateways/store.gateway';
import { ValidateStorePasswordInputDTO } from '../DTOs/validateStorePasswordInput.dto';
import { ValidateStorePasswordUseCase } from '../useCases/validateStorePassword.useCase';
import { StoreDTO } from '../DTOs/store.dto';
import { FindStoreByEmailUseCase } from '../useCases/findStoreByEmail.useCase';
import { StorePresenter } from '../presenters/store.presenter';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { CreateStoreInputDTO } from '../DTOs/createStoreInput.dto';
import { CreateStoreUseCase } from '../useCases/createStore.useCase';

export class StoreCoreController {
  constructor(private dataSource: DataSource) {}

  async validateStorePassword(
    dto: ValidateStorePasswordInputDTO,
  ): Promise<CoreResponse<boolean>> {
    try {
      const gateway = new StoreGateway(this.dataSource);
      const useCase = new ValidateStorePasswordUseCase(gateway);

      const { error: err, value: isValid } = await useCase.execute({
        email: dto.email,
        password: dto.password,
      });

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: isValid };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while validating password',
        ),
        value: undefined,
      };
    }
  }

  async findStoreByEmail(email: string): Promise<CoreResponse<StoreDTO>> {
    try {
      const gateway = new StoreGateway(this.dataSource);
      const useCase = new FindStoreByEmailUseCase(gateway);

      const { error: err, value: store } = await useCase.execute(email);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: StorePresenter.toDto(store) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding store by email',
        ),
        value: undefined,
      };
    }
  }

  async createStore(dto: CreateStoreInputDTO): Promise<CoreResponse<StoreDTO>> {
    try {
      const gateway = new StoreGateway(this.dataSource);
      const useCase = new CreateStoreUseCase(gateway);

      const { error: err, value: store } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: StorePresenter.toDto(store) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError('Something went wrong while creating store'),
        value: undefined,
      };
    }
  }
}
