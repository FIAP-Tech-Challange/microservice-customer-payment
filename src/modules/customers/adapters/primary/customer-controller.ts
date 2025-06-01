import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';
import { CustomerResponseDto } from '../../models/dto/customer-response.dto';
import { CustomerService } from '../../services/customer.service';
import { BusinessException } from 'src/shared/dto/business-exception.dto';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';
import { CustomerInputPort } from '../../ports/input/customer.port';
import { CustomerModel } from '../../models/domain/customer.model';
import { CpfPipe } from '../../models/pipe/cpf.pipe';
import { CustomerRequestParamsDto } from '../../models/dto/customer-request-params.dto';
import { CustomerPaginationDto } from '../../models/dto/customer-pagination.dto';
import { CustomerResponsePaginationDto } from '../../models/dto/customer-response-pagination.dto';

@ApiTags('Customer')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomerController implements CustomerInputPort {
  constructor(private readonly customerService: CustomerService) {}

  @ApiResponse({
    status: 200,
    description: 'Customers list retrieved successfully',
    type: CustomerResponsePaginationDto,
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
    return this.customerService.findAll(params);
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
  async findByCpf(@Param('cpf', CpfPipe) cpf: string): Promise<CustomerModel> {
    return this.customerService.findByCpf(cpf);
  }

  @ApiResponse({
    status: 200,
    description: 'The customer was found successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Customer ID',
    type: String,
  })
  @ApiOperation({ summary: 'Find a customer by ID' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerModel> {
    return await this.customerService.findById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: BusinessException,
  })
  @ApiResponse({
    status: 409,
    description: 'Customer with this CPF already exists',
    type: BusinessException,
  })
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerModel> {
    return this.customerService.create(createCustomerDto);
  }
}
