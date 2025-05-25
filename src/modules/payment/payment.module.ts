import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './models/entities/payment.entity';
import { PaymentController } from './adapters/primary/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepositoryAdapter } from './adapters/secondary/payment-repository.adapter';
import { PaidMarketAdapter } from './adapters/secondary/paid-market.adapter';
import {
  PAYMENT_PROVIDER_PORT,
  PAYMENT_REPOSITORY_PORT,
} from './payment.tokens';
import { ConfigService } from '@nestjs/config';
import { FakePaymentProvider } from './adapters/secondary/fake-payment.adapter';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), OrderModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PAYMENT_REPOSITORY_PORT,
      useClass: PaymentRepositoryAdapter,
    },
    {
      provide: PAYMENT_PROVIDER_PORT,
      useFactory: (configService: ConfigService) => {
        const provider =
          configService.get<string>('fakePaymentProvider') === 'S';
        if (provider) {
          return new FakePaymentProvider();
        }
        return new PaidMarketAdapter(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class PaymentModule {}
