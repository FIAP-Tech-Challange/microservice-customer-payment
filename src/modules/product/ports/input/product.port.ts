import { ProductModel } from "../../models/product.model";
import { CreateProductDto } from "../../models/dto/create-product.dto";
import { UpdateProductDto } from "../../models/dto/update-product.dto";

export interface ProductInputPort {
    findAll(): Promise<ProductModel[]>;
    findOne(id: number): Promise<ProductModel>;
    create(createProductDto: CreateProductDto): Promise<ProductModel>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<ProductModel>;
    remove(id: number): Promise<void>;
}