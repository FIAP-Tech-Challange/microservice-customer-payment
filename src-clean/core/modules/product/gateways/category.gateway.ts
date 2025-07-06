import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CategoryMapper } from '../mappers/category.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Category } from '../entities/category.entity';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';

export class CategoryGateway {
  save(category: Category): { error: any; value: any; } | PromiseLike<{ error: any; value: any; }> {
      throw new Error('Method not implemented.');
  }
  findCategoryByNameAndStoreId(name: string, store_id: string): { error: any; value: any; } | PromiseLike<{ error: any; value: any; }> {
      throw new Error('Method not implemented.');
  }
  constructor(private dataSource: DataSource) {}

  async findCategoryById(id: string): Promise<CoreResponse<Category | null>> {
    const categoryDTO = await this.dataSource.findCategoryById(id) as CategoryDataSourceDTO | null;
    if (!categoryDTO) return { error: undefined, value: null };

    const dtoMapper = CategoryMapper.toEntity(categoryDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async saveCategory(category: Category): Promise<CoreResponse<undefined>> {
    const categoryDTO = CategoryMapper.toPersistenceDTO(category);
    await this.dataSource.saveCategory(categoryDTO);
    return { error: undefined, value: undefined };
  }

  async findCategoryByName(name: string): Promise<CoreResponse<Category | null>> {
    const categoryDTO = await this.dataSource.findCategoryById(name) as CategoryDataSourceDTO | null;

    if (!categoryDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = CategoryMapper.toEntity(categoryDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }
}   