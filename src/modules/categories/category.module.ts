import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductEntity } from './models/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { CATEGORY_REPOSITORY_PORT } from './ports/output/category-repository.port';
import { CategoryRepositoryTypeORM } from './adapters/secondary/category.repository.typeorm';
import { CategoryController } from './adapters/primary/category-controller';
import { CategoryEntity } from './models/entities/category.entity';
import { CategoryService } from './services/category.service';
import { PRODUCT_REPOSITORY_PORT } from './ports/output/product-repository.port';
import { ProductRepositoryTypeORM } from './adapters/secondary/product-repository.typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
    JwtModule,
  ],
  controllers: [CategoryController],
  providers: [
    ProductService,
    CategoryService,
    {
      provide: CATEGORY_REPOSITORY_PORT,
      useClass: CategoryRepositoryTypeORM,
    },
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: ProductRepositoryTypeORM,
    },
  ],
  exports: [ProductService, CategoryService],
})
export class CategoryModule {}
