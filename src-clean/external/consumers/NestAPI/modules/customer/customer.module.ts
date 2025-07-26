import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerController } from './controllers/customer.controller';

@Module({
  imports: [JwtModule],
  controllers: [CustomerController],
})
export class CustomerModule {}
