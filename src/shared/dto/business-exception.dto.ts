import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessException extends HttpException {
  @ApiProperty({
    description: 'Description error',
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
