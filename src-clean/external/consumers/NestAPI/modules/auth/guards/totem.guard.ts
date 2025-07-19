import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { StoreCoreController } from 'src-clean/core/modules/store/controllers/store.controller';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';

@Injectable()
export class TotemGuard implements CanActivate {
  constructor(private readonly dataSource: DataSourceProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromTotemHeader(request);
    if (!token) {
      throw new UnauthorizedException('Totem token not found');
    }

    try {
      const { error, value: store } = await new StoreCoreController(
        this.dataSource,
      ).findByTotemAccessToken(token);

      if (error || !store) {
        throw new UnauthorizedException('Invalid totem token');
      }

      request['storeId'] = store.id;
      request['totemAccessToken'] = token;
      request['totemId'] = store.totems.find(
        (t) => t.tokenAccess === token,
      )?.id;
    } catch {
      throw new UnauthorizedException('Invalid totem token');
    }
    return true;
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
