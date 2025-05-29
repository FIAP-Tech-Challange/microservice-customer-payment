import { CategoryModel } from 'src/modules/categories/models/domain/category.model';
import { ProductModel } from 'src/modules/categories/models/domain/product.model';

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

    category.removeProduct(product.id);
    expect(category.products).toHaveLength(0);
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

    expect(() => category.removeProduct(product.id)).toThrow(
      `Product with ID ${product.id} not found in category.`,
    );
  });

  it('should deactivate and activate a category', () => {
    const category = CategoryModel.create({
      name: 'Test Category',
      storeId: 'some-store-id',
    });
    category.deactivate();
    expect(category.isActive).toBe(false);
    category.activate();
    expect(category.isActive).toBe(true);
  });

  it('should not allow adding a product with duplicate ID', () => {
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
    category.addProduct(product);
    const duplicateProduct = ProductModel.restore({
      id: product.id,
      name: 'Another Name',
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      price: 100,
      prep_time: 10,
      description: 'A nice product',
      image_url: 'http://img.com/2.png',
      store_id: 'some-store-id',
    });
    expect(() => category.addProduct(duplicateProduct)).toThrow(
      `Product with ID ${product.id} already exists in category.`,
    );
  });

  it('should not allow adding a product with duplicate name', () => {
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
    category.addProduct(product);
    const duplicateNameProduct = ProductModel.create({
      name: 'Test Product',
      price: 200,
      prep_time: 20,
      description: 'Another product',
      image_url: 'http://img.com/2.png',
      store_id: 'some-store-id',
    });
    expect(() => category.addProduct(duplicateNameProduct)).toThrow(
      `Product with name Test Product already exists in category.`,
    );
  });

  it('should throw validation error when restoring with missing fields', () => {
    expect(() =>
      CategoryModel.restore({
        id: '',
        name: 'Valid Name',
        isActive: true,
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: 'store-id',
      }),
    ).toThrow('ID is required');
    expect(() =>
      CategoryModel.restore({
        id: 'id',
        name: 'ab',
        isActive: true,
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: 'store-id',
      }),
    ).toThrow('Category name must be at least 3 characters long.');
    expect(() =>
      CategoryModel.restore({
        id: 'id',
        name: 'Valid Name',
        isActive: true,
        products: [],
        createdAt: undefined!,
        updatedAt: new Date(),
        storeId: 'store-id',
      }),
    ).toThrow('CreatedAt is required');
    expect(() =>
      CategoryModel.restore({
        id: 'id',
        name: 'Valid Name',
        isActive: true,
        products: undefined!,
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: 'store-id',
      }),
    ).toThrow('Products array is required');
    expect(() =>
      CategoryModel.restore({
        id: 'id',
        name: 'Valid Name',
        isActive: true,
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: '',
      }),
    ).toThrow('Store ID is required');
  });

  it('should restore a category from props', () => {
    const now = new Date();
    const category = CategoryModel.restore({
      id: 'cat-id',
      name: 'Restored Category',
      isActive: false,
      products: [],
      createdAt: now,
      updatedAt: now,
      storeId: 'store-id',
    });
    expect(category.id).toBe('cat-id');
    expect(category.name).toBe('Restored Category');
    expect(category.isActive).toBe(false);
    expect(category.products).toEqual([]);
    expect(category.createdAt).toBe(now);
    expect(category.updatedAt).toBe(now);
    expect(category.storeId).toBe('store-id');
  });
});
