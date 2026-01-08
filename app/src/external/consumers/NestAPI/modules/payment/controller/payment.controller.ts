import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { PaymentResponseDto } from '.././dto/payment-response.dto';
import { CreatePaymentDto } from '.././dto/create-payment.dto';
import { PaymentCoreController } from 'src/core/modules/payment/controllers/payment.controller';
import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { CreatePaymentResponseDto } from '.././dto/create-payment-response.dto';
import { getPaymentPlatform } from '.././util/payment-platform.util';
import { PaymentIdDto } from '.././dto/payment-id.dto';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { AwsSecretManagerService } from '../../../shared/services/secret-manager.service';
import { AwsParameterStoreService } from '../../../shared/services/parameter-store.service';
import { ConfigService } from '@nestjs/config';
import { StoreGuard } from '../../auth/guards/store.guard';
import { StoreTokenInterface } from '../../auth/dtos/token.dto';
import { ExternalPaymentConsumersGuard } from '../../auth/guards/external-payment-consumers.guard';
import { StoreGuard } from '../../auth/guards/store.guard';
import { StoreTokenInterface } from '../../auth/dtos/token.dto';
import { ExternalPaymentConsumersGuard } from '../../auth/guards/external-payment-consumers.guard';

@ApiTags('Payment')
@Controller({
  path: 'payment',
  version: '1',
})
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(
    private dataSource: DataSourceProxy,
    private secretManager: AwsSecretManagerService,
    private parameterStore: AwsParameterStoreService,
    private configService: ConfigService,
  ) {}

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
  @UseGuards(StoreGuard)
  @UseGuards(StoreGuard)
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: StoreTokenInterface,
    @Request() req: StoreTokenInterface,
  ): Promise<CreatePaymentResponseDto> {
    const coreController = new PaymentCoreController(
      this.dataSource,
      this.configService,
      this.secretManager,
      this.parameterStore,
    );
    const response = await coreController.initiatePayment({
      orderId: createPaymentDto.orderId,
      storeId: req.storeId,
      paymentType: PaymentTypeEnum.QR,
    });

    if (response.error) {
      this.logger.error(`Error created payment :${response.error.message}`);
      if (response.error.code === ResourceNotFoundException.CODE) {
        throw new NotFoundException(response.error.message);
      }

      if (response.error.code === ResourceInvalidException.CODE) {
        throw new BadRequestException(response.error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating the payment',
      );
    }
    this.logger.log(`Payment successfully created ${response.value.id}`);
    return {
      id: response.value.id,
      orderId: response.value.orderId,
      externalId: response.value.externalId,
      qrCode: response.value.qrCode,
      platform: getPaymentPlatform(response.value.platform),
    };
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
  @UseGuards(StoreGuard)
  @UseGuards(StoreGuard)
  @Get(':id')
  async findById(
    @Param() params: PaymentIdDto,
    @Request() req: StoreTokenInterface,
    @Request() req: StoreTokenInterface,
  ): Promise<PaymentResponseDto> {
    const coreController = new PaymentCoreController(
      this.dataSource,
      this.configService,
      this.secretManager,
      this.parameterStore,
    );
    const response = await coreController.findPaymentById(params.id);

    if (response.error) {
      this.logger.error(
        `Error when retrieving payment :${response.error.message}`,
      );
      if (response.error.code === ResourceNotFoundException.CODE) {
        throw new NotFoundException(response.error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong while finding the payment',
      );
    }

    if (response.value.storeId !== req.storeId) {
      this.logger.error(
        `Payment with id ${params.id} not found for store ${req.storeId}`,
      );
      throw new NotFoundException(
        `Payment with id ${params.id} not found for store ${req.storeId}`,
      );
    }

    this.logger.log(`Payment found successfully ${response.value.id}`);
    return {
      id: response.value.id,
      orderId: response.value.orderId,
      externalId: response.value.externalId,
      qrCode: response.value.qrCode,
      platform: response.value.platform,
      status: response.value.status,
      total: response.value.total,
      paymentType: response.value.paymentType,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
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
  @ApiOperation({ summary: 'Approve Payment' })
  @ApiBearerAuth('external-payment-consumer-key')
  @UseGuards(ExternalPaymentConsumersGuard)
  @UseGuards(ExternalPaymentConsumersGuard)
  @Patch(':id/approve')
  async approvePaymentHook(@Param('id') id: string): Promise<void> {
    const coreController = new PaymentCoreController(
      this.dataSource,
      this.configService,
      this.secretManager,
      this.parameterStore,
    );
    const approvePayment = await coreController.approvePayment(id);
    if (approvePayment.error) {
      this.logger.log(
        `Error approve payment id ${id},  ${approvePayment.error.message}`,
      );
      if (approvePayment.error.code === ResourceNotFoundException.CODE) {
        throw new NotFoundException(approvePayment.error.message);
      }

      throw new BusinessException(
        `Something went wrong while approving the payment, ${approvePayment.error.message}`,
        400,
      );
    }
    this.logger.log(`Payment id ${id} approve successfully`);
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
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
  @ApiOperation({ summary: 'Cancel Payment' })
  @ApiBearerAuth('external-payment-consumer-key')
  @UseGuards(ExternalPaymentConsumersGuard)
  @UseGuards(ExternalPaymentConsumersGuard)
  @Patch(':id/cancel')
  async cancelPaymentHook(@Param('id') id: string): Promise<void> {
    const coreController = new PaymentCoreController(
      this.dataSource,
      this.configService,
      this.secretManager,
      this.parameterStore,
    );
    const cancelPayment = await coreController.cancelPayment(id);

    if (cancelPayment.error) {
      this.logger.log(
        `Error canceling payment id ${id},  ${cancelPayment.error.message}`,
      );
      if (cancelPayment.error.code === ResourceNotFoundException.CODE) {
        throw new NotFoundException(cancelPayment.error.message);
      }

      throw new BusinessException(
        `Something went wrong while canceling the payment, ${cancelPayment.error.message}`,
        400,
      );
    }
    this.logger.log(`Payment id ${id} cancelad successfully`);
    return;
  }
}
