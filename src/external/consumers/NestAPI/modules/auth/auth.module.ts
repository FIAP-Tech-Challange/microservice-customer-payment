import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guards/api-key.guard';

@Global()
@Module({
  imports: [
  ],
  providers: [
    AuthService,
    ApiKeyGuard,
  ],
  exports: [
    ApiKeyGuard,
  ],
})
export class AuthModule {}
