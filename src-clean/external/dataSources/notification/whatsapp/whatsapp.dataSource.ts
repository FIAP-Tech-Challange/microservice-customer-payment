export interface WhatsappDataSource {
  sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
}
