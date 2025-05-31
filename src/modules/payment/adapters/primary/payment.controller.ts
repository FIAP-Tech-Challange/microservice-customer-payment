import {
  Body,
  Controller,
  Get,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentResponseDto } from '../../models/dto/payment.dto';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';
import { BusinessException } from 'src/shared/dto/business-exception.dto';
import { ApiKeyGuard } from 'src/modules/auth/guards/api-key.guard';

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
    type: BusinessException,
  })
  @ApiBody({
    description: 'Payment data',
    type: CreatePaymentDto,
  })
  @ApiOperation({ summary: 'Register payment' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
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
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Find Payment' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
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
    type: BusinessException,
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
  @ApiOperation({ summary: 'Update status Payment' })
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusPaymentDto,
    @Request() req: RequestFromStore,
  ): Promise<PaymentModel | null> {
    return this.paymentService.updateStatus(id, dto.status, req.storeId);
  }
}
