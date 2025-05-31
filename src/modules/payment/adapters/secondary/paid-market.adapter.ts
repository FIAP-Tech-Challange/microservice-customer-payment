import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaymentProviderPort } from '../../ports/output/payment.provider';
import { createQrCodeDto } from '../../models/dto/create-qr-code.dto';
import { ResponseQrCodeDto } from '../../models/dto/response-qr-code.dto';
import { ResponseTotemDto } from '../../models/dto/response-totem.dto';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PaidMarketResponseQrCodeDto } from '../../models/dto/paid-market-response-qr-code.dto';
import { PaymentPlataformEnum } from '../../models/enum/payment-plataform.enum';
import { PaymentTypeEnum } from '../../models/enum/payment-type.enum';

@Injectable()
export class PaidMarketAdapter implements PaymentProviderPort {
  platformName: PaymentPlataformEnum = PaymentPlataformEnum.MP;
  paymentType: PaymentTypeEnum = PaymentTypeEnum.QR;

  private readonly logger = new Logger(PaidMarketAdapter.name);
  private axios: AxiosInstance;
  private readonly baseUrl: string | undefined;
  private readonly acessToken: string | undefined;
  private readonly userId: string | undefined;
  private readonly checkout: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('paidMarketBaseUrl');
    this.acessToken = this.configService.get<string>('paidMarketAccessToken');
    this.userId = this.configService.get<string>('paidMarketUserId');
    this.checkout = this.configService.get<string>('paidMarketCheckout');

    if (!this.baseUrl || !this.acessToken || !this.userId || !this.checkout) {
      this.logger.error(
        'Missing required configuration for Paid Market, please check your environment variables.',
      );
    }
    this.axios = axios.create();
  }

  async createQrCode(dto: createQrCodeDto): Promise<ResponseQrCodeDto> {
    const endpoint = `${this.baseUrl}/instore/orders/qr/seller/collectors/${this.userId}/pos/${this.checkout}/qrs`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.acessToken}`,
    };
    const body = {
      external_reference: dto.orderId,
      total_amount: dto.total,
      title: dto.title,
      description: dto.description ?? '',
      items: dto.items
        ? dto?.items.map((item) => ({
            sku_number: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: item.price,
            total_amount: item.totalPrice,
            unit_measure: 'unit',
          }))
        : [
            {
              sku_number: dto.orderId,
              title: dto.title,
              quantity: 1,
              unit_price: dto.total,
              total_amount: dto.total,
              unit_measure: 'unit',
            },
          ],
    };

    try {
      const response = await this.axios.post<PaidMarketResponseQrCodeDto>(
        endpoint,
        body,
        {
          headers,
        },
      );

      if (!response?.data.qr_data) {
        throw new Error('Error creating QR code');
      }

      return {
        id: response.data.in_store_order_id,
        qrCode: response.data.qr_data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          'Error creating QR code:',
          error.response?.data?.message,
        );
        throw new BadRequestException(
          `Error creating QR code: ${error.response?.data?.message}`,
        );
      }

      this.logger.error('Unexpected error creating QR code:', error);
      throw new BadRequestException('Unexpected error creating QR code.');
    }
  }

  findTotemById(id: string): Promise<ResponseTotemDto> {
    throw new Error(`Method not implemented. ${id} searching..`);
  }
}
