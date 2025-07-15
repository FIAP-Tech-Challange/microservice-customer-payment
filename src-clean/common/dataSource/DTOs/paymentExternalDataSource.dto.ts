import { PaymentTypeDataSourceEnum } from '../enums/paymentTypeDataSource.enum';

export interface PaymentExternalDataSourceDTO {
  id: string;
  external_id: string | null;
  payment_type: PaymentTypeDataSourceEnum;
  total: number;
}
