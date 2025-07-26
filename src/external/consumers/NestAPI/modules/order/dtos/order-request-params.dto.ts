import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum } from 'src/core/modules/order/entities/order.entity';

export class OrderRequestParamsDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  storeId?: string;
}
