import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './adapters/primary/product-controller';
import { ProductRepositoryAdapter } from './adapters/secondary/product-repository-adapter';
import { ProductService } from './services/product.service';
import { ProductEntity } from './models/entities/product.entity';
import { PRODUCT_INPUT_PORT, PRODUCT_REPOSITORY_PORT } from './product.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY_PORT, // Porta de saída
      useClass: ProductRepositoryAdapter, // Implementação da porta de saída
    },
    {
      provide: PRODUCT_INPUT_PORT, // Porta de entrada
      useClass: ProductService, // Implementação da porta de entrada
    },
  ],
})
export class ProductModule {}