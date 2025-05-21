import { ItensPaymentDto } from './itens-qr-code.dto';

export class createQrCodeDto {
  orderId: string;
  total: number;
  title?: string;
  description?: string;
  items?: ItensPaymentDto[];
}
