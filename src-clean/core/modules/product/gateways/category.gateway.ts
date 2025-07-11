import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CategoryMapper } from '../mappers/category.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Category } from '../entities/category.entity';

export class CategoryGateway {
  constructor(private dataSource: DataSource) {}

  async findCategoryById(id: string): Promise<CoreResponse<Category | null>> {
    const categoryDTO = await this.dataSource.findCategoryById(id);
    if (!categoryDTO) return { error: undefined, value: null };

    const dtoMapper = CategoryMapper.toEntity(categoryDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async save(category: Category): Promise<CoreResponse<undefined>> {
    const categoryDTO = CategoryMapper.toPersistenceDTO(category);
    await this.dataSource.saveCategory(categoryDTO);
    return { error: undefined, value: undefined };
  }

  async findCategoryByName(
    name: string,
    storeId: string,
  ): Promise<CoreResponse<Category | null>> {
    const categoryDTO = await this.dataSource.findCategoryByNameAndStoreId(
      name,
      storeId,
    );

    if (!categoryDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = CategoryMapper.toEntity(categoryDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }
}
