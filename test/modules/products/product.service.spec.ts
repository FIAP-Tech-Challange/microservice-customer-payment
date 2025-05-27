import { ProductService } from '../../../src/modules/product/services/product.service';
import { ProductModel } from '../../../src/modules/product/models/domain/product.model';
import { CreateProductDto } from '../../../src/modules/product/models/dto/create-product.dto';
import { UpdateProductDto } from '../../../src/modules/product/models/dto/update-product.dto';
import { InMemoryProductRepository } from './adapters/product.repository.in-memory';

describe('ProductService (integration, in-memory)', () => {
  let service: ProductService;
  let repo: InMemoryProductRepository;

  beforeEach(() => {
    repo = new InMemoryProductRepository();
    service = new ProductService(repo);
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      name: 'Test',
      description: 'desc',
      price: 10,
      prep_time: 5,
      image_url: 'img.png',
    };

    const product = await service.create(dto);
    expect(product).toBeInstanceOf(ProductModel);
    expect(product.name).toBe(dto.name);

    const productFromRepo = await repo.findById(product.id);
    expect(productFromRepo).toBeDefined();
    expect(productFromRepo).toEqual(product);
  });

  it('should find all products', async () => {
    const productA = await service.create({
      name: 'Name1234',
      description: '',
      price: 1,
      prep_time: 1,
      image_url: '',
    });
    const productB = await service.create({
      name: 'Name5678',
      description: '',
      price: 2,
      prep_time: 2,
      image_url: '',
    });
    const all = await service.findAll();
    expect(all.length).toBe(2);
    expect(all[0]).toBe(productA);
    expect(all[1]).toBe(productB);
  });

  it('should find product by id', async () => {
    const p = await service.create({
      name: 'FindMe',
      description: '',
      price: 1,
      prep_time: 1,
      image_url: '',
    });
    const found = await service.findById(p.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(p.id);
  });

  it('should update a product', async () => {
    const p = await service.create({
      name: 'Old',
      description: 'desc',
      price: 1,
      prep_time: 1,
      image_url: '',
    });
    const update: UpdateProductDto = {
      name: 'New',
      description: 'newdesc',
      price: 99,
      prep_time: 10,
      image_url: 'new.png',
      is_active: false,
    };
    const updated = await service.update(p.id, update);
    const found = await repo.findById(p.id);
    expect(updated).toBe(found);
  });

  it('should remove a product', async () => {
    const p = await service.create({
      name: 'ToDelete',
      description: '',
      price: 1,
      prep_time: 1,
      image_url: '',
    });
    await service.remove(p.id);
    expect((await repo.findAll()).length).toBe(0);
  });
});
