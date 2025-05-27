import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Query,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
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
      cpf: customer.cpf.format(),
      name: customer.name,
      email: customer.email.toString(),
    };
  }
}
