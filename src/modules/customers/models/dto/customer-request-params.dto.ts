import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CustomerRequestParamsDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
