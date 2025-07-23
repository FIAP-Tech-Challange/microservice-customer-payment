import { EmailDataSource } from './email/email.dataSource';
import { MonitorDataSource } from './monitor/monitor.dataSource';
import { NotificationDataSource } from './notification.dataSource';
import { SmsDataSource } from './sms/sms.dataSource';
import { WhatsappDataSource } from './whatsapp/whatsapp.dataSource';

export class NotificationDataSourceProxy implements NotificationDataSource {
  constructor(
    private smsDataSource: SmsDataSource,
    private whatsappDataSource: WhatsappDataSource,
    private emailDataSource: EmailDataSource,
    private monitorDataSource: MonitorDataSource,
  ) {}

  sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.smsDataSource.sendSMSNotification(phone, message);
  }

  sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.whatsappDataSource.sendWhatsappNotification(phone, message);
  }

  sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.emailDataSource.sendEmailNotification(email, message);
  }

  sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.monitorDataSource.sendMonitorNotification(ip, message);
  }
}
