import { IsNotEmpty, IsString } from 'class-validator';

export class FindCustomerByCpfDto {
  @IsNotEmpty()
  @IsString()
  cpf: string;
}
