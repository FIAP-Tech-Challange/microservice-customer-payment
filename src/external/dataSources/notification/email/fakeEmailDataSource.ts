import { EmailDataSource } from './email.dataSource';

export class FakeEmailDataSource implements EmailDataSource {
  async sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }> {
    console.log(`Sending email to ${email}: ${message}`);
    return Promise.resolve({});
  }
}
