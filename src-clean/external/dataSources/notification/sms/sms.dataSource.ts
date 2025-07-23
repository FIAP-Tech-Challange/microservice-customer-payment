export interface SmsDataSource {
  sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
}
