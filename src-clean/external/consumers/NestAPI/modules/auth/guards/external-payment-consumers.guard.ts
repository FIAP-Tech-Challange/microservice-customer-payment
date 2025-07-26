import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ExternalPaymentConsumersGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const externalPaymentConsumerKey =
      request.headers['x-external-payment-consumer-key'];

    const expectedKey = this.configService.get<string>(
      'externalPaymentConsumerKey',
    );

    if (
      !externalPaymentConsumerKey ||
      expectedKey !== externalPaymentConsumerKey
    ) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
