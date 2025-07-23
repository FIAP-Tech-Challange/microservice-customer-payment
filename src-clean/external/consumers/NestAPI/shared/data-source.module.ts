import { Module, Global } from '@nestjs/common';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { createPostgresGeneralDataSource } from 'src-clean/external/dataSources/general/postgres/createPostgresDataSource';
import { FakeEmailDataSource } from 'src-clean/external/dataSources/notification/email/fakeEmailDataSource';
import { FakeMonitorDataSource } from 'src-clean/external/dataSources/notification/monitor/fakeMonitorDataSource';
import { NotificationDataSourceProxy } from 'src-clean/external/dataSources/notification/notificationDataSourceProxy';
import { FakeSmsDataSource } from 'src-clean/external/dataSources/notification/sms/fakeSmsDataSource';
import { FakeWhatsAppDataSource } from 'src-clean/external/dataSources/notification/whatsapp/fakeWhatsappDataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';

@Global()
@Module({
  providers: [
    {
      provide: DataSourceProxy,
      useFactory: async () => {
        const generalDataSource = await createPostgresGeneralDataSource();
        const paymentDataSource = new FakePaymentDataSource();
        const notificationDataSource = new NotificationDataSourceProxy(
          new FakeSmsDataSource(),
          new FakeWhatsAppDataSource(),
          new FakeEmailDataSource(),
          new FakeMonitorDataSource(),
        );
        return new DataSourceProxy(
          generalDataSource,
          paymentDataSource,
          notificationDataSource,
        );
      },
    },
  ],
  exports: [DataSourceProxy],
})
export class DataSourceModule {}
