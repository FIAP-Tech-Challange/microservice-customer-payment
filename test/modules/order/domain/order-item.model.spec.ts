/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';

describe('OrderItemModel', () => {
  describe('create', () => {
    it('should create a valid order item model', () => {
      const orderItem = OrderItemModel.create({
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
      });

      expect(orderItem).toBeDefined();
      expect(orderItem.id).toBeDefined();
      expect(orderItem.productId).toBe('product-123');
      expect(orderItem.unitPrice).toBe(10.5);
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.subtotal).toBe(21); // unitPrice * quantity
      expect(orderItem.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when productId is not provided', () => {
      expect(() => {
        OrderItemModel.create({
          productId: '',
          unitPrice: 10.5,
          quantity: 2,
        });
      }).toThrow('Product ID is required');
    });

    it('should throw error when unitPrice is zero or negative', () => {
      expect(() => {
        OrderItemModel.create({
          productId: 'product-123',
          unitPrice: 0,
          quantity: 2,
        });
      }).toThrow('Unit price must be greater than zero');

      expect(() => {
        OrderItemModel.create({
          productId: 'product-123',
          unitPrice: -10,
          quantity: 2,
        });
      }).toThrow('Unit price must be greater than zero');
    });

    it('should throw error when quantity is zero or negative', () => {
      expect(() => {
        OrderItemModel.create({
          productId: 'product-123',
          unitPrice: 10.5,
          quantity: 0,
        });
      }).toThrow('Quantity must be greater than zero');

      expect(() => {
        OrderItemModel.create({
          productId: 'product-123',
          unitPrice: 10.5,
          quantity: -2,
        });
      }).toThrow('Quantity must be greater than zero');
    });
  });

  describe('restore', () => {
    it('should create a valid order item model from props', () => {
      const createdAt = new Date();
      const props = {
        id: 'item-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        createdAt,
      };

      const orderItem = OrderItemModel.restore(props);

      expect(orderItem).toBeDefined();
      expect(orderItem.id).toBe('item-123');
      expect(orderItem.productId).toBe('product-123');
      expect(orderItem.unitPrice).toBe(10.5);
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.subtotal).toBe(21);
      expect(orderItem.createdAt).toBe(createdAt);
    });

    it('should throw error when id is not provided', () => {
      const props = {
        id: '',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.restore(props);
      }).toThrow('ID is required');
    });

    it('should throw error when productId is not provided', () => {
      const props = {
        id: 'item-123',
        productId: '',
        unitPrice: 10.5,
        quantity: 2,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.restore(props);
      }).toThrow('Product ID is required');
    });

    it('should throw error when unitPrice is zero or negative', () => {
      const props = {
        id: 'item-123',
        productId: 'product-123',
        unitPrice: 0,
        quantity: 2,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.restore(props);
      }).toThrow('Unit price must be greater than zero');
    });

    it('should throw error when quantity is zero or negative', () => {
      const props = {
        id: 'item-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 0,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.restore(props);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when createdAt is not provided', () => {
      const props = {
        id: 'item-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
      } as any;

      expect(() => {
        OrderItemModel.restore(props);
      }).toThrow('Created at date is required');
    });
  });
});
