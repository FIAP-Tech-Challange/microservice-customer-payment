import { PaymentTypeDataSourceEnum } from 'src-clean/common/dataSource/enums/paymentTypeDataSource.enum';

export type InitiatePaymentInputDTO = {
  orderId: string;
  storeId: string;
  paymentType: PaymentTypeDataSourceEnum;
};
