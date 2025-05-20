import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Query,
  Version,
  Inject,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerInputPort } from '../../ports/input/customer.port';
import { CreateCustomerDto } from '../../models/dto/create-customer.dto';
import { FindCustomerByCpfDto } from '../../models/dto/find-customer-by-cpf.dto';
import { CustomerResponseDto } from '../../models/dto/customer-response.dto';
import { CUSTOMER_INPUT_PORT } from '../../customers.tokens';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_INPUT_PORT)
    private readonly customerInputPort: CustomerInputPort,
  ) {}

  @Get('/cpf')
  @Version('1')
  @ApiOperation({ summary: 'Find a customer by CPF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The customer was found successfully',
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
    const customer = await this.customerInputPort.findByCpf(
      findCustomerDto.cpf,
    );

    const response = new CustomerResponseDto();
    response.id = customer.id;
    response.cpf = customer.cpf;
    response.name = customer.name;
    response.email = customer.email;

    return response;
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The customer has been successfully created',
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
    const customer = await this.customerInputPort.create(createCustomerDto);

    const response = new CustomerResponseDto();
    response.id = customer.id;
    response.cpf = customer.cpf;
    response.name = customer.name;
    response.email = customer.email;

    return response;
  }
}
