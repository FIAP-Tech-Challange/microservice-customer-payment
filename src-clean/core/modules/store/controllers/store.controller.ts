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
import { AddTotemInputDTO } from '../DTOs/addTotemInput.dto';
import { TotemDTO } from '../DTOs/totem.dto';
import { AddTotemUseCase } from '../useCases/addTotem.useCase';
import { TotemPresenter } from '../presenters/totem.presenter';
import { TotemGateway } from '../gateways/totem.gateway';
import { FindStoreTotemByAccessTokenUseCase } from '../useCases/findStoreTotemByAccessToken.useCase';
import { CategoryGateway } from '../../product/gateways/category.gateway';

export class StoreCoreController {
  constructor(private dataSource: DataSource) {}

  async addTotemToStore(
    dto: AddTotemInputDTO,
  ): Promise<CoreResponse<TotemDTO>> {
    try {
      const gateway = new StoreGateway(this.dataSource);
      const useCase = new AddTotemUseCase(gateway);

      const totem = await useCase.execute(dto);
      if (totem.error) return { error: totem.error, value: undefined };

      return { error: undefined, value: TotemPresenter.toDto(totem.value) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError('Something went wrong while adding totem'),
        value: undefined,
      };
    }
  }

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
      const storeGateway = new StoreGateway(this.dataSource);
      const categoryGateway = new CategoryGateway(this.dataSource);
      const useCase = new CreateStoreUseCase(storeGateway, categoryGateway);

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

  async findStoreTotemByAccessToken(
    accessToken: string,
  ): Promise<CoreResponse<TotemDTO>> {
    try {
      const gateway = new TotemGateway(this.dataSource);
      const useCase = new FindStoreTotemByAccessTokenUseCase(gateway);

      const totem = await useCase.execute(accessToken);

      if (totem.error) return { error: totem.error, value: undefined };

      return { error: undefined, value: TotemPresenter.toDto(totem.value) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding totem by access token',
        ),
        value: undefined,
      };
    }
  }
}
