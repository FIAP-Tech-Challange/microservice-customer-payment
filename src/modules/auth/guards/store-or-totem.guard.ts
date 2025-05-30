import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StoreTokenInterface } from '../models/dtos/token.dto';
import { ConfigService } from '@nestjs/config';
import { StoresService } from 'src/modules/stores/stores.service';

@Injectable()
export class StoreOrTotemGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private storeService: StoresService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractBearerTokenFromHeader(request);
    const totemAccessToken = this.extractTokenFromTotemHeader(request);

    if (!token && !totemAccessToken) {
      throw new UnauthorizedException('Token and totem access token not found');
    }

    if (token) {
      try {
        const payload: StoreTokenInterface = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET'),
          },
        );

        request['storeId'] = payload.storeId;
        request['totemId'] = null;
        request['totemAccessToken'] = null;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    if (totemAccessToken) {
      try {
        const store =
          await this.storeService.findByTotemAccessToken(totemAccessToken);

        request['storeId'] = store.id;
        request['totemAccessToken'] = totemAccessToken;
        request['totemId'] = store.totems.find(
          (t) => t.tokenAccess === totemAccessToken,
        )?.id;
      } catch {
        throw new UnauthorizedException('Invalid totem access token');
      }
    }

    return true;
  }

  private extractBearerTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromTotemHeader(request: Request): string | undefined {
    const headerKey = Object.keys(request.headers).find(
      (key) => key.toLowerCase() === 'x-totem-access-token',
    );

    if (!headerKey) return undefined;

    const token = request.headers[headerKey];

    return Array.isArray(token) ? token[0] : token;
  }
}
