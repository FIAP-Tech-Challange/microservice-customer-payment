import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  imports: [
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
  providers: [AuthService, ApiKeyGuard],
  exports: [JwtModule, ApiKeyGuard],
})
export class AuthModule {}
