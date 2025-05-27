import { ProductService } from '../../../src/modules/product/services/product.service';
import { ProductModel } from '../../../src/modules/product/models/domain/product.model';
import { CreateProductDto } from '../../../src/modules/product/models/dto/create-product.dto';
import { UpdateProductDto } from '../../../src/modules/product/models/dto/update-product.dto';
import { InMemoryProductRepository } from './adapters/product.repository.in-memory';

describe('ProductService (integration, in-memory)', () => {
  let service: ProductService;
  let repo: InMemoryProductRepository;
  const storeId = 'test-store-id';

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    service = new ProductService(repo);
  });

  describe('create', () => {
    it('should create a product with valid data', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        prep_time: 5,
        image_url: 'test.png',
      };

      const product = await service.create(dto, storeId);
      expect(product).toBeInstanceOf(ProductModel);
      expect(product.name).toBe(dto.name);
      expect(product.store_id).toBe(storeId);
      expect(product.description).toBe(dto.description);
      expect(product.price).toBe(dto.price);
      expect(product.prep_time).toBe(dto.prep_time);
      expect(product.image_url).toBe(dto.image_url);
      expect(product.is_active).toBe(true);
      expect(product.created_at).toBeDefined();
      expect(product.updated_at).toBeDefined();

      const productFromRepo = await repo.findById(product.id);
      expect(productFromRepo).toBeDefined();
      expect(productFromRepo).toEqual(product);
    });
  });

  describe('update', () => {
    it('should update a product with valid data', async () => {
      const createDto: CreateProductDto = {
        name: 'Old Product',
        description: 'Old Description',
        price: 10,
        prep_time: 5,
        image_url: 'old.png',
      };

      const product = await service.create(createDto, storeId);

      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20,
        prep_time: 10,
        image_url: 'updated.png',
        is_active: false,
      };

      const updatedProduct = await service.update(
        product.id,
        updateDto,
        storeId,
      );
      expect(updatedProduct.name).toBe(updateDto.name);
      expect(updatedProduct.description).toBe(updateDto.description);
      expect(updatedProduct.price).toBe(updateDto.price);
      expect(updatedProduct.prep_time).toBe(updateDto.prep_time);
      expect(updatedProduct.image_url).toBe(updateDto.image_url);
      expect(updatedProduct.is_active).toBe(updateDto.is_active);

      const productFromRepo = await repo.findById(product.id);
      expect(productFromRepo).toBeDefined();
      expect(productFromRepo).toEqual(updatedProduct);
    });

    it('should fail to update a product if it does not belong to the store', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        prep_time: 5,
        image_url: 'test.png',
      };

      const product = await service.create(createDto, storeId);

      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20,
        prep_time: 10,
        image_url: 'updated.png',
        is_active: false,
      };

      await expect(
        service.update(product.id, updateDto, storeId + 'another'),
      ).rejects.toThrow('Product with ID ' + product.id + ' not found');
    });

    it('should throw an error if product not found', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20,
        prep_time: 10,
        image_url: 'updated.png',
        is_active: false,
      };

      await expect(
        service.update('non-existing-id', updateDto, storeId),
      ).rejects.toThrow('Product with ID non-existing-id not found');
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const createDto: CreateProductDto = {
        name: 'Product to Delete',
        description: 'Description',
        price: 10,
        prep_time: 5,
        image_url: 'delete.png',
      };

      const product = await service.create(createDto, storeId);
      await service.remove(product.id, storeId);

      const productFromRepo = await repo.findById(product.id);
      expect(productFromRepo).toBeNull();
    });

    it('should throw an error if trying to remove a product that does not exist', async () => {
      await expect(service.remove('non-existing-id', storeId)).rejects.toThrow(
        'Product with ID non-existing-id not found',
      );
    });

    it('should throw an error if trying to remove a product that belongs to another store', async () => {
      const createDto: CreateProductDto = {
        name: 'Product to Delete',
        description: 'Description',
        price: 10,
        prep_time: 5,
        image_url: 'delete.png',
      };

      const product = await service.create(createDto, storeId + 'another');
      await expect(service.remove(product.id, storeId)).rejects.toThrow(
        'Product with ID ' + product.id + ' not found',
      );
    });
  });

  describe('findById', () => {
    it('should find a product by ID', async () => {
      const createDto: CreateProductDto = {
        name: 'Find Me',
        description: 'Description',
        price: 10,
        prep_time: 5,
        image_url: 'find.png',
      };

      const product = await service.create(createDto, storeId);
      const foundProduct = await service.findById(product.id, storeId);

      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toBe(product.id);
      expect(foundProduct.name).toBe(product.name);
    });

    it('should throw an error if product not found', async () => {
      await expect(
        service.findById('non-existing-id', storeId),
      ).rejects.toThrow('Product with ID non-existing-id not found');
    });

    it('should throw an error if product belongs to another store', async () => {
      const createDto: CreateProductDto = {
        name: 'Find Me Another Store',
        description: 'Description',
        price: 10,
        prep_time: 5,
        image_url: 'find_another.png',
      };

      const product = await service.create(createDto, storeId + 'another');
      await expect(service.findById(product.id, storeId)).rejects.toThrow(
        'Product with ID ' + product.id + ' not found',
      );
    });
  });

  describe('findAll', () => {
    it('should find all products from the store', async () => {
      const productA = await service.create(
        {
          name: 'Product A',
          description: 'Description A',
          price: 10,
          prep_time: 5,
          image_url: 'a.png',
        },
        storeId,
      );
      const productB = await service.create(
        {
          name: 'Product B',
          description: 'Description B',
          price: 20,
          prep_time: 10,
          image_url: 'b.png',
        },
        storeId,
      );
      await service.create(
        {
          name: 'Product C',
          description: 'Description C',
          price: 30,
          prep_time: 15,
          image_url: 'c.png',
        },
        storeId + 'another',
      );

      const allProducts = await service.findAll(storeId);
      expect(allProducts.length).toBe(2);
      expect(allProducts[0]).toEqual(productA);
      expect(allProducts[1]).toEqual(productB);
    });
  });
});
