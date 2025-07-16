import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CategoryDTO } from '../DTOs/category.dto';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CreateCategoryInputDTO } from '../DTOs/createCategoryInput.dto';
import { CategoryGateway } from '../gateways/category.gateway';
import { CreateCategoryUseCase } from '../useCases/createCategory.useCase';
import { StoreGateway } from '../../store/gateways/store.gateway';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { CategoryPresenter } from '../presenters/category.presenter';
import { CreateProductInputDTO } from '../DTOs/createProductInput.dto';
import { CreateProductUseCase } from '../useCases/createProduct.useCase';
import { ProductPresenter } from '../presenters/product.presenter';
import { ProductDTO } from '../DTOs/product.dto';
import { FindCategoryByIdUseCase } from '../useCases/findCategoryById.useCase';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';

export class ProductCoreController {
  constructor(private dataSource: DataSource) {}

  async createProductCategory(
    dto: CreateCategoryInputDTO,
  ): Promise<CoreResponse<CategoryDTO>> {
    try {
      const categoryGateway = new CategoryGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);
      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
      const useCase = new CreateCategoryUseCase(
        categoryGateway,
        findStoreByIdUseCase,
      );

      const { error: err, value: category } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CategoryPresenter.toDto(category) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while creating category',
        ),
        value: undefined,
      };
    }
  }

  async createProduct(
    dto: CreateProductInputDTO,
  ): Promise<CoreResponse<ProductDTO>> {
    try {
      const categoryGateway = new CategoryGateway(this.dataSource);
      const storeGateway = new StoreGateway(this.dataSource);
      const findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
      const findCategoryByIdUseCase = new FindCategoryByIdUseCase(
        categoryGateway,
      );
      const useCase = new CreateProductUseCase(
        categoryGateway,
        findStoreByIdUseCase,
        findCategoryByIdUseCase,
      );

      const { error: err, value: product } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: ProductPresenter.toDto(product) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while creating product',
        ),
        value: undefined,
      };
    }
  }

  async findCategoryById(
    id: string,
    storeId: string,
  ): Promise<CoreResponse<CategoryDTO>> {
    try {
      const gateway = new CategoryGateway(this.dataSource);
      const useCase = new FindCategoryByIdUseCase(gateway);

      const { error: err, value: category } = await useCase.execute(
        id,
        storeId,
      );

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CategoryPresenter.toDto(category) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding category by id',
        ),
        value: undefined,
      };
    }
  }
}
