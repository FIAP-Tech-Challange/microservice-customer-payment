import { IsNotEmpty, IsString, IsNumber, IsUrl, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  prep_time: number;

  @IsUrl()
  image_url?: string;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsNotEmpty()
  @IsNumber()
  store_id: number;
}