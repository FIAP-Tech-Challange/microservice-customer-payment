import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StoreTokenInterface } from '../dtos/token.dto';
import { ConfigService } from '@nestjs/config';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';

@Injectable()
export class StoreOrTotemGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSourceProxy,
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
            secret: this.configService.get<string>('jwtSecret'),
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
        const coreController = new StoreCoreController(this.dataSource);
        const findByToken =
          await coreController.findStoreByTotemAccessToken(totemAccessToken);

        if (findByToken.error) {
          throw new UnauthorizedException('Invalid totem access token');
        }

        request['storeId'] = findByToken.value.id;
        request['totemAccessToken'] = totemAccessToken;
        request['totemId'] = findByToken.value.totems.find(
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
