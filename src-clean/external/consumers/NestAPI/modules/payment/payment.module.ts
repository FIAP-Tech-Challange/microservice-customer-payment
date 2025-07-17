import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './payment.controller';

@Module({
  imports: [JwtModule],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
