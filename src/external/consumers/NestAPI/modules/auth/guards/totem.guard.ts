import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';

@Injectable()
export class TotemGuard implements CanActivate {
  constructor(private dataSource: DataSourceProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromTotemHeader(request);
    if (!token) {
      throw new UnauthorizedException('Totem token not found');
    }

    try {
      const storeCoreController = new StoreCoreController(this.dataSource);
      const findStore =
        await storeCoreController.findStoreByTotemAccessToken(token);
      if (findStore.error) {
        throw findStore.error;
      }

      request['storeId'] = findStore.value.id;
      request['totemAccessToken'] = token;
      request['totemId'] = findStore.value.totems.find(
        (t) => t.tokenAccess === token,
      )?.id;
    } catch (error) {
      console.error(error);
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
