import { Module, Global } from '@nestjs/common';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { createPostgresGeneralDataSource } from 'src/external/dataSources/general/postgres/createPostgresDataSource';

@Global()
@Module({
  providers: [
    {
      provide: DataSourceProxy,
      useFactory: async () => {
        const generalDataSource = await createPostgresGeneralDataSource();
        return new DataSourceProxy(
          generalDataSource,
        );
      },
    },
  ],
  exports: [DataSourceProxy],
})
export class DataSourceModule {}
