import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CategoryController } from './controller/category-controller';

@Module({
  imports: [JwtModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
