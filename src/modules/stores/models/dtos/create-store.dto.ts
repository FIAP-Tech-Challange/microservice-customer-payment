import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateStoreInputDto {
  @ApiProperty({
    description: 'CNPJ field company',
    example: '00000000000000',
  })
  @IsString()
  @IsNotEmpty({
    message: 'CNPJ field cannot be empty',
  })
  cnpj: string;

  @ApiProperty({
    description: 'E-mail field company',
    example: 'email@gmail.com',
  })
  @IsEmail(
    {},
    {
      message: 'Necessary inform e-mail valid',
    },
  )
  @IsNotEmpty({
    message: 'E-mail field cannot be empty',
  })
  email: string;

  @ApiProperty({
    description: 'Password for access',
    example: 'Senh@1',
  })
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Name company',
    example: 'Snack Bar Fiap LTDA',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Name field necessary for 4 or more caracteres',
  })
  name: string;

  @ApiProperty({
    description: 'Name company',
    example: 'Snack Bar Fiap',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Fantasy name field necessary or 4 or more caracteres',
  })
  fantasy_name: string;

  @ApiProperty({
    description: 'Contact telephone number',
    example: '5521999999999',
  })
  @IsString()
  @IsNotEmpty({
    message: 'Phone field cannot be empty',
  })
  phone: string;
}
