import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessException extends HttpException {
  @ApiProperty({
    description: 'Error description',
  })
  message: string;

  @ApiProperty({
    description: 'Code error',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Type Error',
  })
  error: string;
}
