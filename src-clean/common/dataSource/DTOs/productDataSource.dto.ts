export interface ProductDataSourceDTO {
    id: string;
    name: string;
    price: number;
    description?: string;
    prep_time: number;
    image_url?: string;
    created_at: Date;
    updated_at: Date;
    store_id: string;
  }
  