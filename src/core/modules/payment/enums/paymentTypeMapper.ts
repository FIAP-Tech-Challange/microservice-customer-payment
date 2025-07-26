import { PaymentTypeDataSourceEnum } from 'src/common/dataSource/enums/paymentTypeDataSource.enum';
import { PaymentTypeEnum } from './paymentType.enum';

export const paymentTypeMap: Record<
  PaymentTypeEnum,
  PaymentTypeDataSourceEnum
> = {
  [PaymentTypeEnum.QR]: PaymentTypeDataSourceEnum.QR,
  [PaymentTypeEnum.PIX]: PaymentTypeDataSourceEnum.PIX,
  [PaymentTypeEnum.MON]: PaymentTypeDataSourceEnum.MON,
  [PaymentTypeEnum.CAR]: PaymentTypeDataSourceEnum.CAR,
};
