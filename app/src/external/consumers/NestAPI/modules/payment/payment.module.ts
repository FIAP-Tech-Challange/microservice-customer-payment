import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './controller/payment.controller';
import { AwsModule } from '../../shared/aws.module';

@Module({
  imports: [JwtModule, AwsModule],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
