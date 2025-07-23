export interface EmailDataSource {
  sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }>;
}
