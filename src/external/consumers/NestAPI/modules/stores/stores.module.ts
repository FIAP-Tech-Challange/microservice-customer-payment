import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StoresController } from './controller/stores.controller';

@Module({
  imports: [JwtModule],
  controllers: [StoresController],
})
export class StoresModule {}
