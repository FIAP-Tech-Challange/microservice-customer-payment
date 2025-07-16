export interface PaymentCreateExternalDataSourceResponseDTO {
  externalId: string;
  qrCode: string | null;
  paymentPlatform: 'Mercado Pago' | 'Stripe' | 'Fake Provider';
}
