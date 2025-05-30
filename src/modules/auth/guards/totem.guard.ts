import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { StoresService } from 'src/modules/stores/stores.service';

@Injectable()
export class TotemGuard implements CanActivate {
  constructor(private storeService: StoresService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromTotemHeader(request);
    if (!token) {
      throw new UnauthorizedException('Totem token not found');
    }

    try {
      const store = await this.storeService.findByTotemAccessToken(token);

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
