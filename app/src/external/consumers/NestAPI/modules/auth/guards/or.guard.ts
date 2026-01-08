import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export function OrGuard(...guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class OrGuardMixin implements CanActivate {
    constructor(private moduleRef: ModuleRef) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const errors: string[] = [];

      for (const GuardType of guards) {
        try {
          // Tenta obter a instância do guard do container de injeção de dependências
          let guardInstance: CanActivate;

          try {
            guardInstance = this.moduleRef.get(GuardType, { strict: false });
          } catch {
            // Se não estiver no container, cria uma nova instância
            guardInstance = new GuardType();
          }

          const result = await guardInstance.canActivate(context);

          if (result) {
            return true;
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Authentication failed';

          errors.push(message);
        }
      }

      // Se nenhum guard passou, lança exceção
      throw new UnauthorizedException(
        `Access denied: All authentication methods failed. ${errors.join(' | ')}`,
      );
    }
  }

  return mixin(OrGuardMixin);
}
