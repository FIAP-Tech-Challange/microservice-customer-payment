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
import { FindStoreByTotemAccessTokenUseCase } from '../useCases/findStoreByTotemAccessToken.useCase';
import { CategoryGateway } from '../../product/gateways/category.gateway';
import { CreateCategoryUseCase } from '../../product/useCases/createCategory.useCase';
import { CreateStoreWithDefaultCategoriesUseCase } from '../useCases/createStoreWithDeafaultCategories.useCase';
import { FindStoreByIdUseCase } from '../useCases/findStoreById.useCase';

export class StoreCoreController {
  constructor(private dataSource: DataSource) {}

  async addTotemToStore(
    dto: AddTotemInputDTO,
  ): Promise<CoreResponse<TotemDTO>> {
    try {
      const gateway = new StoreGateway(this.dataSource);

      const findStoreByIdUseCase = new FindStoreByIdUseCase(gateway);
      const addTotemUseCase = new AddTotemUseCase(
        gateway,
        findStoreByIdUseCase,
      );

      const totem = await addTotemUseCase.execute(dto);
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
      const findStoreByEmailUseCase = new FindStoreByEmailUseCase(gateway);
      const useCase = new ValidateStorePasswordUseCase(findStoreByEmailUseCase);

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
      const createStoreUseCase = new CreateStoreUseCase(storeGateway);
      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);

      const categoryGateway = new CategoryGateway(this.dataSource);
      const createCategoryUseCase = new CreateCategoryUseCase(
        categoryGateway,
        findStoreByIdUseCase,
      );

      const useCase = new CreateStoreWithDefaultCategoriesUseCase(
        createStoreUseCase,
        createCategoryUseCase,
      );

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

  async findStoreByTotemAccessToken(
    accessToken: string,
  ): Promise<CoreResponse<StoreDTO>> {
    try {
      const gateway = new StoreGateway(this.dataSource);
      const useCase = new FindStoreByTotemAccessTokenUseCase(gateway);

      const store = await useCase.execute(accessToken);

      if (store.error) return { error: store.error, value: undefined };

      return { error: undefined, value: StorePresenter.toDto(store.value) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding store by totem access token',
        ),
        value: undefined,
      };
    }
  }
}
