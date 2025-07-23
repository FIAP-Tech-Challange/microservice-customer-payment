import { SmsDataSource } from './sms.dataSource';

export class FakeSmsDataSource implements SmsDataSource {
  async sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    // Simulate sending an SMS notification
    console.log(`Sending SMS to ${phone}: ${message}`);
    return Promise.resolve({}); // Simulate success
  }
}
