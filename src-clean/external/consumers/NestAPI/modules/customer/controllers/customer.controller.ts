import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerIdDto } from '../dtos/customer-id.dto';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { StoreGuard } from '../../auth/guards/store.guard';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/response-customer.dto';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { CustomerCoreController } from 'src-clean/core/modules/customer/controllers/customer.controller';

@ApiTags('Customer')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomerController {
  constructor(private dataSourceProxy: DataSourceProxy) {}

  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerIdDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Customer has not been created, already exists',
    type: BusinessException,
  })
  @ApiResponse({
    status: 400,
    description: 'Customer has not been created',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Customer data',
    type: CreateCustomerDto,
  })
  @ApiOperation({ summary: 'Register your customer' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerIdDto> {
    try {
      const coreController = new CustomerCoreController(this.dataSourceProxy);
      const createCustomer = await coreController.createCustomer({
        name: dto.name,
        email: dto.email,
        cpf: dto.cpf,
      });
      if (createCustomer.error) {
        throw new BadRequestException(createCustomer.error.message);
      }
      return { id: createCustomer.value.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Customer found successfully',
    type: CustomerResponseDto,
  })
  @ApiOperation({
    summary: 'Find Customer',
    description: 'Retrieves the customer based on the customerId.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get(':id')
  async findById(@Req() req, @Param('id') id: string): Promise<CustomerResponseDto> {
    const coreController = new CustomerCoreController(this.dataSourceProxy);
    const findCustomer = await coreController.findCustomerById(id);
    if (findCustomer.error) {
      throw new BadRequestException(findCustomer.error.message);
    }
    return {
      id: findCustomer.value.id,
      name: findCustomer.value.name,
      email: findCustomer.value.email,
      cpf: findCustomer.value.cpf,
    };
  }
}