import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CreateProductInputDTO } from '../DTOs/createProductInput.dto';
import { ProductGateway } from '../gateways/product.gateway';
import { Product } from '../entities/product.entity';
import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';

export class CreateProductUseCase {
  constructor(private productGateway: ProductGateway) {}

  async execute(dto: CreateProductInputDTO): Promise<CoreResponse<Product>> {
    const { error: createErr, value: product } = Product.create({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        storeId: dto.store_id,
        prepTime: 0,
        imageUrl: dto.image_url,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    if (createErr) return { error: createErr, value: undefined };

    const { error: findErr, value: existingProduct } =
      await this.productGateway.findProductByNameAndStoreId(
        dto.name,
        dto.store_id,
      );
    if (findErr) return { error: findErr, value: undefined };
    if (existingProduct) {
      return {
        error: new ResourceConflictException(
          'Product with this name already exists in the store',
        ),
        value: undefined,
      };
    }

    const { error: saveErr, value: savedProduct } =
      await this.productGateway.save(product);
    if (saveErr) return { error: saveErr, value: undefined };

    return { error: undefined, value: savedProduct };
  }
}