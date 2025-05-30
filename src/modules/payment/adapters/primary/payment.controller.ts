import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentDto } from '../../models/dto/create-payment.dto';
import { PaymentModel } from '../../models/domain/payment.model';
import { PaymentInputPort } from '../../ports/input/payment.port';
import { PaymentService } from '../../services/payment.service';
import { PaymentIdDto } from '../../models/dto/payment-id.dto';
import { UpdateStatusPaymentDto } from '../../models/dto/update-status-payment.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentResponseDto } from '../../models/dto/payment.dto';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';

@ApiTags('Payment')
@Controller({
  path: 'payment',
  version: '1',
})
export class PaymentController implements PaymentInputPort {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Payment has not been created',
    type: BadRequestException,
  })
  @ApiBody({
    description: 'Payment data',
    type: CreatePaymentDto,
  })
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentModel | null> {
    return this.paymentService.savePayment(createPaymentDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Payment found successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: String,
    required: true,
  })
  @Get(':id')
  async findById(@Param() params: PaymentIdDto): Promise<PaymentModel> {
    return this.paymentService.findById(params.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Payment status has not been updated',
    type: BadRequestException,
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'Payment status data',
    type: UpdateStatusPaymentDto,
    required: true,
  })
  @UseGuards(StoreGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusPaymentDto,
    @Request() req: RequestFromStore,
  ): Promise<PaymentModel | null> {
    return this.paymentService.updateStatus(id, dto.status, req.storeId);
  }
}
