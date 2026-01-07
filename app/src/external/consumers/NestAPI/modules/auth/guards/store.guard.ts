import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { StoreTokenInterface } from '../dtos/token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AwsSecretManagerService } from '../../../shared/services/secret-manager.service';

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private secretManager: AwsSecretManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    const jwtSecretName = this.configService.get<string>('jwtSecretName');

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    if (!jwtSecretName) {
      throw new UnauthorizedException('JWT secret name is not configured');
    }

    try {
      const secret = await this.secretManager.getSecretValue(jwtSecretName);

      const jwtService = new JwtService({
        secret: secret,
        signOptions: {
          expiresIn: this.configService.get<number>(
            'jwtAccessTokenExpirationTime',
          ),
        },
      });

      const payload: StoreTokenInterface = await jwtService.verifyAsync(token, {
        secret: secret,
      });

      request['storeId'] = payload.storeId;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
