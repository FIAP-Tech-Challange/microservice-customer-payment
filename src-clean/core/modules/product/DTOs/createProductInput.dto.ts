export interface CreateProductInputDTO {
    name: string;
    price: number;
    description?: string;
    prep_time: number;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
    category_id?: string;
    store_id: string;
}