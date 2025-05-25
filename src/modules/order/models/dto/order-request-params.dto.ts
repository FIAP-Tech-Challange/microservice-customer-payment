import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { Type } from 'class-transformer';

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
}
