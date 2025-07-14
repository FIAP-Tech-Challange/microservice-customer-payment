export interface CreateProductInputDTO {
  product: {
    name: string;
    price: number;
    description?: string;
    prepTime: number;
    imageUrl?: string;
  };
  categoryId: string;
  storeId: string;
}
