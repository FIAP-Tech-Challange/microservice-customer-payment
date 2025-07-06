import { ProductDTO } from "./product.dto";

export interface CategoryDTO {
    id: string;
    name: string;
    products: ProductDTO[];
    created_at: Date;
    updated_at: Date;
    store_id: string;
}