import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StoresModule } from '../stores/stores.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { StoreOrTotemGuard } from './guards/store-or-totem.guard';
import { StoreGuard } from './guards/store.guard';
import { TotemGuard } from './guards/totem.guard';
import { ApiKeyGuard } from './guards/api-key.guard';

@Global()
@Module({
  imports: [
    StoresModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('jwtSecret'),
          signOptions: {
            expiresIn: config.get<string>('jwtAccessTokenExpirationTime'),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    StoreOrTotemGuard,
    TotemGuard,
    StoreGuard,
    ApiKeyGuard,
  ],
  exports: [
    JwtModule,
    StoresModule,
    StoreOrTotemGuard,
    TotemGuard,
    StoreGuard,
    ApiKeyGuard,
  ],
})
export class AuthModule {}
