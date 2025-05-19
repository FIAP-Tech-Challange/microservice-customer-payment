import { IsOptional, IsString, IsNumber, IsUrl, Min, IsIn } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name?: string;

  @IsNumber()
  price?: number;

  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsString()
  description?: string;

  @IsNumber()
  prep_time?: number;

  @IsUrl()
  image_url?: string;

  @IsNumber()
  category_id?: number;

  @IsNumber()
  store_id?: number;
}