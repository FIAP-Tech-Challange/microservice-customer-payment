import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { statusOptionsMessage } from '../../util/status-order.util';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Status order',
    example: `${statusOptionsMessage}`,
  })
  @IsEnum(OrderStatusEnum, {
    message: `status must be one of the following values ${statusOptionsMessage}`,
  })
  status: OrderStatusEnum;
}
