import { Category } from 'src/core/modules/product/entities/category.entity';
import { Product } from 'src/core/modules/product/entities/product.entity';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

describe('Category Entity Tests', () => {
  describe('Category Creation', () => {
    it('should create a category with valid data', () => {
      const { error, value: category } = Category.create({
        name: 'Hamburgers',
        storeId: 'store-123',
      });

      expect(error).toBeUndefined();
      expect(category).toBeDefined();
      expect(category!.name).toBe('Hamburgers');
      expect(category!.storeId).toBe('store-123');
      expect(category!.id).toBeDefined();
      expect(category!.createdAt).toBeDefined();
      expect(category!.updatedAt).toBeDefined();
      expect(category!.products).toEqual([]);
    });

    it('should fail to create category with name too short', () => {
      const { error, value: category } = Category.create({
        name: 'AB',
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(category).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Category name must be at least 3 characters long',
      );
    });

    it('should fail to create category with empty name', () => {
      const { error, value: category } = Category.create({
        name: '',
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(category).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Category name must be at least 3 characters long',
      );
    });

    it('should fail to create category without store ID', () => {
      const { error, value: category } = Category.create({
        name: 'Hamburgers',
        storeId: '',
      });

      expect(error).toBeDefined();
      expect(category).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain('Category must belong to a store');
    });
  });

  describe('Category Restoration', () => {
    it('should restore a category with valid props', () => {
      const now = new Date();
      const categoryProps = {
        id: 'category-123',
        name: 'Hamburgers',
        createdAt: now,
        updatedAt: now,
        products: [],
        storeId: 'store-123',
      };

      const { error, value: category } = Category.restore(categoryProps);

      expect(error).toBeUndefined();
      expect(category).toBeDefined();
      expect(category!.id).toBe('category-123');
      expect(category!.name).toBe('Hamburgers');
      expect(category!.createdAt).toBe(now);
      expect(category!.updatedAt).toBe(now);
      expect(category!.products).toEqual([]);
      expect(category!.storeId).toBe('store-123');
    });

    it('should fail to restore category with invalid props', () => {
      const now = new Date();
      const categoryProps = {
        id: '',
        name: 'Hamburgers',
        createdAt: now,
        updatedAt: now,
        products: [],
        storeId: 'store-123',
      };

      const { error, value: category } = Category.restore(categoryProps);

      expect(error).toBeDefined();
      expect(category).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain('Category must have an id');
    });
  });

  describe('Product Management', () => {
    let category: Category;
    let product1: Product;
    let product2: Product;

    beforeEach(() => {
      const categoryResult = Category.create({
        name: 'Hamburgers',
        storeId: 'store-123',
      });
      category = categoryResult.value!;

      const product1Result = Product.create({
        name: 'Big Burger',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      });
      product1 = product1Result.value!;

      const product2Result = Product.create({
        name: 'Cheese Burger',
        price: 22.99,
        prepTime: 12,
        storeId: 'store-123',
      });
      product2 = product2Result.value!;
    });

    it('should add a product to category successfully', () => {
      const { error } = category.addProduct(product1);

      expect(error).toBeUndefined();
      expect(category.products).toHaveLength(1);
      expect(category.products[0]).toBe(product1);
    });

    it('should add multiple products to category', () => {
      const { error: error1 } = category.addProduct(product1);
      const { error: error2 } = category.addProduct(product2);

      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(category.products).toHaveLength(2);
      expect(category.products).toContain(product1);
      expect(category.products).toContain(product2);
    });

    it('should fail to add product with duplicate name', () => {
      category.addProduct(product1);

      const duplicateNameProduct = Product.create({
        name: 'Big Burger',
        price: 30.99,
        prepTime: 18,
        storeId: 'store-123',
      }).value!;

      const { error } = category.addProduct(duplicateNameProduct);

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ResourceConflictException);
      expect(error?.message).toContain(
        'Product with this name already exists in the category',
      );
      expect(category.products).toHaveLength(1);
    });

    it('should fail to add product with duplicate ID', () => {
      category.addProduct(product1);

      const differentProduct = Product.create({
        name: 'Different Product',
        price: 30.99,
        prepTime: 18,
        storeId: 'store-123',
      }).value!;

      Object.defineProperty(differentProduct, '_id', {
        value: product1.id,
        writable: false,
        configurable: true,
      });

      const { error } = category.addProduct(differentProduct);

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ResourceConflictException);
      expect(error?.message).toContain(
        'Product with this id already exists in the category',
      );
      expect(category.products).toHaveLength(1);
    });

    it('should remove a product from category successfully', () => {
      category.addProduct(product1);
      category.addProduct(product2);

      const { error } = category.removeProduct(product1.id);

      expect(error).toBeUndefined();
      expect(category.products).toHaveLength(1);
      expect(category.products[0]).toBe(product2);
    });

    it('should fail to remove non-existent product', () => {
      category.addProduct(product1);

      const { error } = category.removeProduct('non-existent-id');

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ResourceConflictException);
      expect(error?.message).toContain(
        'Product with this id does not exist in the category',
      );
      expect(category.products).toHaveLength(1);
    });

    it('should update updatedAt when adding product', () => {
      const initialUpdatedAt = category.updatedAt;

      category.addProduct(product1);

      expect(category.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime(),
      );
    });

    it('should update updatedAt when removing product', () => {
      category.addProduct(product1);
      const updatedAtAfterAdd = category.updatedAt;

      category.removeProduct(product1.id);

      expect(category.updatedAt.getTime()).toBeGreaterThanOrEqual(
        updatedAtAfterAdd.getTime(),
      );
    });
  });
});
