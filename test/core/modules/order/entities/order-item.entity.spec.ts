import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { OrderItem } from 'src/core/modules/order/entities/order-item.entity';

describe('OrderItem Entity', () => {
  describe('create', () => {
    it('should create a valid order item', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: 2,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(OrderItem);
      expect(result.value!.productId).toBe('product-123');
      expect(result.value!.unitPrice).toBe(15.99);
      expect(result.value!.quantity).toBe(2);
      expect(result.value!.subtotal).toBe(31.98);
      expect(result.value!.id).toBeDefined();
      expect(result.value!.createdAt).toBeInstanceOf(Date);
    });

    it('should fail to create order item with empty product ID', () => {
      const orderItemData = {
        productId: '',
        unitPrice: 15.99,
        quantity: 2,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Product ID is required');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order item with zero unit price', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 0,
        quantity: 2,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Unit price must be greater than zero',
      );
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order item with negative unit price', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: -10.5,
        quantity: 2,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Unit price must be greater than zero',
      );
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order item with zero quantity', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: 0,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Quantity must be greater than zero');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order item with negative quantity', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: -1,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Quantity must be greater than zero');
      expect(result.value).toBeUndefined();
    });
  });

  describe('restore', () => {
    it('should restore a valid order item', () => {
      const orderItemData = {
        id: 'order-item-123',
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: 2,
        createdAt: new Date(),
      };

      const result = OrderItem.restore(orderItemData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(OrderItem);
      expect(result.value!.id).toBe('order-item-123');
      expect(result.value!.productId).toBe('product-123');
      expect(result.value!.unitPrice).toBe(15.99);
      expect(result.value!.quantity).toBe(2);
      expect(result.value!.subtotal).toBe(31.98);
      expect(result.value!.createdAt).toBe(orderItemData.createdAt);
    });

    it('should fail to restore order item with empty ID', () => {
      const orderItemData = {
        id: '',
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: 2,
        createdAt: new Date(),
      };

      const result = OrderItem.restore(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('ID is required');
      expect(result.value).toBeUndefined();
    });

    it('should fail to restore order item without created at date', () => {
      const orderItemData = {
        id: 'order-item-123',
        productId: 'product-123',
        unitPrice: 15.99,
        quantity: 2,
        createdAt: null as unknown as Date,
      };

      const result = OrderItem.restore(orderItemData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Created at date is required');
      expect(result.value).toBeUndefined();
    });
  });

  describe('subtotal calculation', () => {
    it('should calculate correct subtotal for integer values', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 10,
        quantity: 3,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.value!.subtotal).toBe(30);
    });

    it('should calculate correct subtotal for decimal values', () => {
      const orderItemData = {
        productId: 'product-123',
        unitPrice: 12.45,
        quantity: 4,
      };

      const result = OrderItem.create(orderItemData);

      expect(result.value!.subtotal).toBe(49.8);
    });
  });
});
