import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AwsSecretManagerService } from '../../../shared/services/secret-manager.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private secretManager: AwsSecretManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.headers['x-api-key'];

    const apiKeySecretName = this.configService.get<string>('apiKeySecretName');

    if (!apiKeySecretName) {
      throw new UnauthorizedException('API key secret name is not configured');
    }

    const expectedApiKey =
      await this.secretManager.getSecretValue(apiKeySecretName);

    if (!expectedApiKey) {
      throw new UnauthorizedException('API key not found in secret manager');
    }

    if (!apiKeyHeader || apiKeyHeader !== expectedApiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
