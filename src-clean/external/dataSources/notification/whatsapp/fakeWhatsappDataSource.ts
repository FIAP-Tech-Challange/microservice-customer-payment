import { WhatsappDataSource } from './whatsapp.dataSource';

export class FakeWhatsAppDataSource implements WhatsappDataSource {
  async sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    // Simulate sending a WhatsApp notification
    console.log(`Sending WhatsApp notification to ${phone}: ${message}`);
    return Promise.resolve({}); // Simulate success
  }
}
