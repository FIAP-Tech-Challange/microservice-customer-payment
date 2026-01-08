import { Module, Global } from '@nestjs/common';
import { AwsParameterStoreService } from './services/parameter-store.service';
import { AwsSecretManagerService } from './services/secret-manager.service';

@Global()
@Module({
  providers: [AwsSecretManagerService, AwsParameterStoreService],
  exports: [AwsSecretManagerService, AwsParameterStoreService],
})
export class AwsModule {}
