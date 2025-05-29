import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../models/entities/category.entity';
import { CategoryRepositoryPort } from '../../ports/output/category-repository.port';
import { CategoryModel } from '../../models/domain/category.model';
import { CategoryMapper } from '../../models/category.mapper';

@Injectable()
export class CategoryRepositoryTypeORM implements CategoryRepositoryPort {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findByName(
    name: string,
    storeId: string,
  ): Promise<CategoryModel | null> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { name: name, store_id: storeId },
    });

    return categoryEntity ? CategoryMapper.toModel(categoryEntity) : null;
  }

  async findById(id: string) {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id: id },
    });

    return categoryEntity ? CategoryMapper.toModel(categoryEntity) : null;
  }

  async findAll(storeId: string): Promise<CategoryModel[]> {
    const categoryEntities = await this.categoryRepository.find({
      where: { store_id: storeId },
    });
    return categoryEntities.map((entity) => CategoryMapper.toModel(entity));
  }

  async save(category: CategoryModel): Promise<void> {
    await this.categoryRepository.save(CategoryMapper.toEntity(category));
  }
}
