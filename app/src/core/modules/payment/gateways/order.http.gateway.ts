import axios, { AxiosInstance, AxiosError } from 'axios';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { OrderDTO } from '../DTOs/order.dto';

export class OrderHttpGateway {
  private readonly client: AxiosInstance;

  constructor(
    private readonly baseUrl: string,
    apiKey: string,
  ) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });
  }

  async findById(orderId: string): Promise<CoreResponse<OrderDTO | null>> {
    return this.handleRequest(
      () => this.client.get<OrderDTO>(`/orders/${orderId}`),
      { returnNullOn404: true },
    );
  }

  async setToReceived(orderId: string): Promise<CoreResponse<void>> {
    return this.handleRequest(() =>
      this.client.patch(`/orders/${orderId}`, { status: 'RECEIVED' }),
    );
  }

  async setToCanceled(orderId: string): Promise<CoreResponse<void>> {
    return this.handleRequest(() =>
      this.client.patch(`/orders/${orderId}`, { status: 'CANCELED' }),
    );
  }

  private async handleRequest<T>(
    request: () => Promise<{ data: T }>,
    options: { returnNullOn404?: boolean } = {},
  ): Promise<CoreResponse<T | null>> {
    try {
      const response = await request();
      return { error: undefined, value: response.data };
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;

      if (status === 404) {
        if (options.returnNullOn404) return { error: undefined, value: null };
        return {
          error: new ResourceNotFoundException('Order not found'),
          value: undefined,
        };
      }

      return {
        error: new UnexpectedError(axiosError.message || 'Order service error'),
        value: undefined,
      };
    }
  }
}
