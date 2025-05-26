import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Query,
  Version,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';
import { FindCustomerByCpfDto } from '../../models/dto/find-customer-by-cpf.dto';
import { CustomerResponseDto } from '../../models/dto/customer-response.dto';
import { CustomerService } from '../../services/customer.service';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/cpf')
  @Version('1')
  @ApiOperation({ summary: 'Find a customer by CPF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The customer was found successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid CPF format',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async findByCpf(
    @Query() findCustomerDto: FindCustomerByCpfDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findByCpf(findCustomerDto.cpf);
    return {
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
    };
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The customer has been successfully created',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Customer with this CPF already exists',
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.create(createCustomerDto);
    return {
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
    };
  }

  @Get('/:id')
  @Version('1')
  @ApiOperation({ summary: 'Find a customer by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Customer ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The customer was found successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findById(id);
    return {
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
    };
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customers list retrieved successfully',
    type: [CustomerResponseDto],
  })
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.findAll();
    return customers.map((customer) => ({
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
    }));
  }
}
