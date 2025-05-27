import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './adapters/primary/product-controller';
import { ProductRepositoryTypeORM } from './adapters/secondary/product-repository.typeorm';
import { ProductService } from './services/product.service';
import { ProductEntity } from './models/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT } from './product.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: ProductRepositoryTypeORM,
    },
  ],
})
export class ProductModule {}
