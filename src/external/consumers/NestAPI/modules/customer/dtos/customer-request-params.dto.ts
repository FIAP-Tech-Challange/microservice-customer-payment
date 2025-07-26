import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CustomerRequestParamsDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of customers per page',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Filter by customer CPF',
    required: false,
    type: String,
  })
  @IsOptional()
  cpf?: string;

  @ApiProperty({
    description: 'Filter by customer name',
    required: false,
    type: String,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Filter by customer email',
    required: false,
    type: String,
  })
  @IsOptional()
  email?: string;
}
