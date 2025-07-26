import { Product } from 'src/core/modules/product/entities/product.entity';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('Product Entity Tests', () => {
  describe('Product Creation', () => {
    it('should create a product with valid data', () => {
      const { error, value: product } = Product.create({
        name: 'Hamburger Clássico',
        price: 25.99,
        description: 'Delicioso hamburger com carne, alface e tomate',
        prepTime: 15,
        imageUrl: 'https://example.com/image.jpg',
        storeId: 'store-123',
      });

      expect(error).toBeUndefined();
      expect(product).toBeDefined();
      expect(product!.name).toBe('Hamburger Clássico');
      expect(product!.price).toBe(25.99);
      expect(product!.description).toBe(
        'Delicioso hamburger com carne, alface e tomate',
      );
      expect(product!.prepTime).toBe(15);
      expect(product!.imageUrl).toBe('https://example.com/image.jpg');
      expect(product!.storeId).toBe('store-123');
      expect(product!.id).toBeDefined();
      expect(product!.createdAt).toBeDefined();
      expect(product!.updatedAt).toBeDefined();
    });

    it('should create a product with minimal data', () => {
      const { error, value: product } = Product.create({
        name: 'Pizza Margherita',
        price: 35.5,
        prepTime: 20,
        storeId: 'store-456',
      });

      expect(error).toBeUndefined();
      expect(product).toBeDefined();
      expect(product!.name).toBe('Pizza Margherita');
      expect(product!.price).toBe(35.5);
      expect(product!.description).toBe('');
      expect(product!.prepTime).toBe(20);
      expect(product!.imageUrl).toBeUndefined();
      expect(product!.storeId).toBe('store-456');
    });

    it('should fail to create product with name too short', () => {
      const { error, value: product } = Product.create({
        name: 'AB',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Product name must be at least 3 characters long',
      );
    });

    it('should fail to create product with empty name', () => {
      const { error, value: product } = Product.create({
        name: '',
        price: 25.99,
        prepTime: 15,
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Product name must be at least 3 characters long',
      );
    });

    it('should fail to create product with zero price', () => {
      const { error, value: product } = Product.create({
        name: 'Hamburger',
        price: 0,
        prepTime: 15,
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Product price must be greater than zero',
      );
    });

    it('should fail to create product with negative price', () => {
      const { error, value: product } = Product.create({
        name: 'Hamburger',
        price: -10,
        prepTime: 15,
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain(
        'Product price must be greater than zero',
      );
    });

    it('should fail to create product with negative prep time', () => {
      const { error, value: product } = Product.create({
        name: 'Hamburger',
        price: 25.99,
        prepTime: -5,
        storeId: 'store-123',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain('Product prep time cannot be negative');
    });

    it('should fail to create product without store ID', () => {
      const { error, value: product } = Product.create({
        name: 'Hamburger',
        price: 25.99,
        prepTime: 15,
        storeId: '',
      });

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error?.message).toContain('Store ID is required for the product');
    });

    it('should create product with zero prep time', () => {
      const { error, value: product } = Product.create({
        name: 'Cold Drink',
        price: 5.99,
        prepTime: 0,
        storeId: 'store-123',
      });

      expect(error).toBeUndefined();
      expect(product).toBeDefined();
      expect(product!.prepTime).toBe(0);
    });
  });

  describe('Product Restoration', () => {
    it('should restore a product with valid props', () => {
      const now = new Date();
      const productProps = {
        id: 'product-123',
        name: 'Hamburger Clássico',
        price: 25.99,
        description: 'Delicioso hamburger',
        prepTime: 15,
        imageUrl: 'https://example.com/image.jpg',
        createdAt: now,
        updatedAt: now,
        storeId: 'store-123',
      };

      const { error, value: product } = Product.restore(productProps);

      expect(error).toBeUndefined();
      expect(product).toBeDefined();
      expect(product!.id).toBe('product-123');
      expect(product!.name).toBe('Hamburger Clássico');
      expect(product!.price).toBe(25.99);
      expect(product!.description).toBe('Delicioso hamburger');
      expect(product!.prepTime).toBe(15);
      expect(product!.imageUrl).toBe('https://example.com/image.jpg');
      expect(product!.createdAt).toBe(now);
      expect(product!.updatedAt).toBe(now);
      expect(product!.storeId).toBe('store-123');
    });

    it('should fail to restore product with invalid props', () => {
      const now = new Date();
      const productProps = {
        id: 'product-123',
        name: '',
        price: 25.99,
        description: 'Delicioso hamburger',
        prepTime: 15,
        imageUrl: 'https://example.com/image.jpg',
        createdAt: now,
        updatedAt: now,
        storeId: 'store-123',
      };

      const { error, value: product } = Product.restore(productProps);

      expect(error).toBeDefined();
      expect(product).toBeUndefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
    });
  });
});
