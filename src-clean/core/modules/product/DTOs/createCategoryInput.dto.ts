export interface CreateCategoryInputDTO {
  name: string;
  created_at?: Date;
  updated_at?: Date;
  store_id: string;
  prodct_ids?: string[];
}   