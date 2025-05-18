import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './adapters/primary/product-controller';
import { ProductRepositoryAdapter } from './adapters/secondary/product-repository-adapter';
import { ProductService } from './services/product.service';
import { ProductEntity } from './models/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepositoryPort',
      useClass: ProductRepositoryAdapter,
    },
  ],
})
export class ProductModule {}