import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerIdDto } from '../dtos/customer-id.dto';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { StoreGuard } from '../../auth/guards/store.guard';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/response-customer.dto';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { CustomerCoreController } from 'src/core/modules/customer/controllers/customer.controller';
import { CustomerRequestParamsDto } from '../dtos/customer-request-params.dto';
import { CustomerPaginationDto } from '../dtos/customer-pagination.dto';
import { StoreOrTotemGuard } from '../../auth/guards/store-or-totem.guard';

@ApiTags('Customer')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);
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
    const coreController = new CustomerCoreController(this.dataSourceProxy);
    const createCustomer = await coreController
      .createCustomer({
        name: dto.name,
        email: dto.email,
        cpf: dto.cpf,
      })
      .catch((error) => {
        this.logger.error(`Error in create customer: ${error.message}`);
        throw new InternalServerErrorException(error.message);
      });

    if (createCustomer.error) {
      this.logger.error(
        `Error creating customer: ${createCustomer.error.message}`,
      );
      throw new BusinessException(createCustomer.error.message, 400);
    }
    this.logger.log(
      `Customer created successfully: ${createCustomer.value.id}`,
    );
    return { id: createCustomer.value.id };
  }

  @ApiResponse({
    status: 200,
    description: 'Customer found successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or does not exist',
    type: BusinessException,
  })
  @ApiOperation({
    summary: 'Find Customer',
    description: 'Retrieves the customer based on the customerId.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get(':id')
  async findById(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const coreController = new CustomerCoreController(this.dataSourceProxy);
    const findCustomer = await coreController.findCustomerById(id);
    if (findCustomer.error) {
      this.logger.error(
        `Error finding customer with id ${id}: ${findCustomer.error.message}`,
      );
      throw new BusinessException(findCustomer.error.message, 404);
    }
    this.logger.log(`Customer found successfully: ${findCustomer.value.id}`);
    return {
      id: findCustomer.value.id,
      name: findCustomer.value.name,
      email: findCustomer.value.email,
      cpf: findCustomer.value.cpf,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Customers list retrieved successfully',
    type: CustomerPaginationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customers not found',
    type: BusinessException,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of customers per page',
    type: Number,
  })
  @ApiOperation({ summary: 'List all customers' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Get()
  async findAll(
    @Query() params: CustomerRequestParamsDto,
  ): Promise<CustomerPaginationDto> {
    const coreController = new CustomerCoreController(this.dataSourceProxy);
    const { error, value: customers } =
      await coreController.findAllCustomersPaginated({
        page: params.page ?? 1,
        size: params.limit ?? 10,
        cpf: params.cpf,
        name: params.name,
        email: params.email,
      });

    if (error) {
      this.logger.error(`Error finding all customers: ${error.message}`);
      throw new BusinessException(error.message, 404);
    }
    this.logger.log(`Customers found successfully: ${customers.data.length}`);
    return {
      page: customers.page,
      limit: customers.limit,
      total: customers.total,
      totalPages: customers.totalPages,
      data: customers.data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The customer was found successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid CPF format',
    type: BusinessException,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'cpf',
    description: 'CPF customer',
    type: String,
    required: true,
    example: '12609871677',
  })
  @ApiOperation({ summary: 'Find a customer by CPF' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Get('cpf/:cpf')
  async findByCpf(@Param('cpf') cpf: string): Promise<CustomerResponseDto> {
    const coreController = new CustomerCoreController(this.dataSourceProxy);
    const { error, value: customer } =
      await coreController.findCustomerByCPF(cpf);
    if (error) {
      this.logger.error(
        `Error finding customer with CPF ${cpf}: ${error.message}`,
      );
      throw new BusinessException(error.message, 404);
    }
    this.logger.log(`Customer found successfully: ${customer.id}`);
    return customer;
  }
}
