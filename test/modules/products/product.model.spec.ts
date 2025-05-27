import { ProductModel } from '../../../src/modules/product/models/domain/product.model';

describe('ProductModel', () => {
  it('should create a valid product', () => {
    const product = ProductModel.create({
      name: 'Test Product',
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/1.png',
    });
    expect(product).toBeInstanceOf(ProductModel);
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(100);
    expect(product.is_active).toBe(true);
    expect(product.description).toBe('A nice product');
    expect(product.image_url).toBe('http://img.com/1.png');
    expect(product.created_at).toBeInstanceOf(Date);
    expect(product.updated_at).toBeInstanceOf(Date);
    expect(product.id).toBeDefined();
  });

  it('should throw if name is too short', () => {
    expect(() =>
      ProductModel.create({
        name: 'ab',
        price: 100,
        prep_time: 10,
      }),
    ).toThrow('Name is too short, must be at least 3 characters');
  });

  it('should throw if name is too long', () => {
    expect(() =>
      ProductModel.create({
        name: 'a'.repeat(256),
        price: 100,
        prep_time: 10,
      }),
    ).toThrow('Name must be less than 255 characters');
  });

  it('should throw if description is too long', () => {
    expect(() =>
      ProductModel.create({
        name: 'Valid Name',
        price: 100,
        prep_time: 10,
        description: 'a'.repeat(501),
      }),
    ).toThrow('Description must be less than 500 characters');
  });

  it('should throw if price is not positive', () => {
    expect(() =>
      ProductModel.create({
        name: 'Valid Name',
        price: 0,
        prep_time: 10,
      }),
    ).toThrow('Price must be a positive number');
  });

  it('should throw if prep_time is not positive', () => {
    expect(() =>
      ProductModel.create({
        name: 'Valid Name',
        price: 10,
        prep_time: 0,
      }),
    ).toThrow('Preparation time must be a positive number');
  });

  it('should update values with changeValues()', () => {
    const product = ProductModel.create({
      name: 'Old Name',
      price: 10,
      prep_time: 5,
      description: 'desc',
      image_url: 'img.png',
    });
    const oldUpdatedAt = product.updated_at;
    product.changeValues({
      name: 'New Name',
      price: 20,
      is_active: false,
      description: 'new desc',
      prep_time: 15,
      image_url: 'newimg.png',
    });
    expect(product.name).toBe('New Name');
    expect(product.price).toBe(20);
    expect(product.is_active).toBe(false);
    expect(product.description).toBe('new desc');
    expect(product.prep_time).toBe(15);
    expect(product.image_url).toBe('newimg.png');
    expect(product.updated_at.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });
});
