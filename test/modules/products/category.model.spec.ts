import { CategoryModel } from 'src/modules/product/models/domain/category.model';
import { ProductModel } from 'src/modules/product/models/domain/product.model';

describe('CategoryModel', () => {
  it('should create a valid category', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });

    expect(category).toBeInstanceOf(CategoryModel);
    expect(category.id).toBeDefined();
    expect(category.name).toBe('Test Category');
    expect(category.isActive).toBe(true);
    expect(category.products).toEqual([]);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.storeId).toBe('some-store-id');
  });

  it('should throw if name is too short', () => {
    expect(() =>
      CategoryModel.create({
        name: 'ab',
        storeId: 'some-store-id',
      }),
    ).toThrow('Category name must be at least 3 characters long.');
  });

  it('should throw if name is too long', () => {
    expect(() =>
      CategoryModel.create({
        name: 'a'.repeat(256),
        storeId: 'some-store-id',
      }),
    ).toThrow('Category name must be at most 255 characters long.');
  });

  it('should throw if storeId is not provided', () => {
    expect(() =>
      CategoryModel.create({
        name: 'Valid Name',
        storeId: '',
      }),
    ).toThrow('Store ID is required');
  });

  it('should add a product to the category', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });

    const firstUpdate = category.updatedAt;
    expect(firstUpdate).toBeInstanceOf(Date);

    const product = ProductModel.create({
      name: 'Test Product',
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/1.png',
      store_id: 'some-store-id',
    });

    category.addProduct(product);

    expect(category.products).toHaveLength(1);
    expect(category.products).toContainEqual(product);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.updatedAt).not.toEqual(firstUpdate);
  });

  it('should fail to add a product from another store', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });

    const product = ProductModel.create({
      name: 'Test Product',
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/1.png',
      store_id: 'another-store-id',
    });

    expect(() => category.addProduct(product)).toThrow(
      `Product with ID ${product.id} does not belong to this category's store.`,
    );
  });

  it('should remove a product from the category', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });

    const firstUpdate = category.updatedAt;
    expect(firstUpdate).toBeInstanceOf(Date);
    expect(category.products).toHaveLength(0);

    const product = ProductModel.create({
      name: 'Test Product',
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/1.png',
      store_id: 'some-store-id',
    });

    category.addProduct(product);
    expect(category.products).toHaveLength(1);
    expect(category.products).toContainEqual(product);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.updatedAt).not.toEqual(firstUpdate);

    const secondUpdate = category.updatedAt;
    category.removeProduct(product);

    expect(category.products).toHaveLength(0);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.updatedAt).not.toEqual(secondUpdate);
  });

  it('should throw an error when trying to remove a product that does not exist in the category', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });

    const product = ProductModel.create({
      name: 'Test Product',
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/1.png',
      store_id: 'some-store-id',
    });

    expect(() => category.removeProduct(product)).toThrow(
      `Product with ID ${product.id} not found in category.`,
    );
  });
});
