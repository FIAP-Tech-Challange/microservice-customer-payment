import { Module, Global } from '@nestjs/common';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { createPostgresGeneralDataSource } from 'src-clean/external/dataSources/general/postgres/createPostgresDataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';

@Global()
@Module({
  providers: [
    {
      provide: DataSourceProxy,
      useFactory: async () => {
        const generalDataSource = await createPostgresGeneralDataSource();
        const paymentDataSource = new FakePaymentDataSource();
        return new DataSourceProxy(generalDataSource, paymentDataSource);
      },
    },
  ],
  exports: [DataSourceProxy],
})
export class DataSourceModule {}
