import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StoresModule } from '../stores/stores.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './adapters/primary/auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    StoresModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
