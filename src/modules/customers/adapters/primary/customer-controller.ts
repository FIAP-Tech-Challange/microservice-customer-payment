import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';
import { FindCustomerByCpfDto } from '../../models/dto/find-customer-by-cpf.dto';
import { CustomerResponseDto } from '../../models/dto/customer-response.dto';
import { CustomerService } from '../../services/customer.service';
import { BusinessException } from 'src/shared/dto/business-exception.dto';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';

@ApiTags('Customer')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
  @ApiOperation({ summary: 'Find a customer by CPF' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Get('/cpf')
  async findByCpf(
    @Query() findCustomerDto: FindCustomerByCpfDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findByCpf(findCustomerDto.cpf);
    return {
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    };
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
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.create(createCustomerDto);
    return {
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    };
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
  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findById(id);
    return {
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Customers list retrieved successfully',
    type: [CustomerResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Customers not found',
    type: BusinessException,
  })
  @ApiOperation({ summary: 'List all customers' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.findAll();
    return customers.map((customer) => ({
      id: customer.id,
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    }));
  }
}
