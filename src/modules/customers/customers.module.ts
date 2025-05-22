import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './models/entities/customer.entity';
import { CustomerController } from './adapters/primary/customer-controller';
import { CustomerRepositoryAdapter } from './adapters/secondary/customer-repository-adapter';
import { CustomerService } from './services/customer.service';
import {
  CUSTOMER_INPUT_PORT,
  CUSTOMER_REPOSITORY_PORT,
} from './customers.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY_PORT,
      useClass: CustomerRepositoryAdapter,
    },
    {
      provide: CUSTOMER_INPUT_PORT,
      useClass: CustomerService,
    },
  ],
  exports: [CUSTOMER_REPOSITORY_PORT],
})
export class CustomersModule {}
