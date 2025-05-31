import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInInputDto {
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
    message: 'E-mail necessary for login',
  })
  email: string;

  @ApiProperty({
    description: 'Password for access',
    example: 'Senh@1',
  })
  @IsNotEmpty({
    message: 'Password necessary',
  })
  @IsString()
  password: string;
}

export class SignInOutputDto {
  @ApiProperty({
    description: 'Access Token',
    example:
      'Senh@yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdG9yZUlkIjoiZWE2MTcxZTktOWFmNy00N2..',
  })
  access_token: string;
}
