export interface CategoryResponseDto {
  id: string;
  name: string;
  isActive: boolean;
  products: ProductResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  prepTime: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
}
