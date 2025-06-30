import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StoreController } from './controllers/store.controller';

@Global()
@Module({
  imports: [JwtModule],
  controllers: [StoreController],
  providers: [],
  exports: [],
})
export class StoreModule {}
