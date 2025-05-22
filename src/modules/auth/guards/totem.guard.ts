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

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const store = await this.storeService.findByTotemAccessToken(token);

      request['storeId'] = store.id;
      request['totemAccessToken'] = token;
      request['totemId'] = store.totems.find(
        (t) => t.tokenAccess === token,
      )?.id;
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
