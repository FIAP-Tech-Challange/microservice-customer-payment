/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';

describe('OrderItemModel', () => {
  describe('create', () => {
    it('should create a valid order item model', () => {
      const orderItem = OrderItemModel.create({
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
      });

      expect(orderItem).toBeDefined();
      expect(orderItem.id).toBeDefined();
      expect(orderItem.orderId).toBe('order-123');
      expect(orderItem.productId).toBe('product-123');
      expect(orderItem.unitPrice).toBe(10.5);
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.subtotal).toBe(21); // unitPrice * quantity
      expect(orderItem.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when orderId is not provided', () => {
      expect(() => {
        OrderItemModel.create({
          orderId: '',
          productId: 'product-123',
          unitPrice: 10.5,
          quantity: 2,
        });
      }).toThrow('Order ID is required');
    });

    it('should throw error when productId is not provided', () => {
      expect(() => {
        OrderItemModel.create({
          orderId: 'order-123',
          productId: '',
          unitPrice: 10.5,
          quantity: 2,
        });
      }).toThrow('Product ID is required');
    });

    it('should throw error when unitPrice is zero or negative', () => {
      expect(() => {
        OrderItemModel.create({
          orderId: 'order-123',
          productId: 'product-123',
          unitPrice: 0,
          quantity: 2,
        });
      }).toThrow('Unit price must be greater than zero');

      expect(() => {
        OrderItemModel.create({
          orderId: 'order-123',
          productId: 'product-123',
          unitPrice: -10,
          quantity: 2,
        });
      }).toThrow('Unit price must be greater than zero');
    });

    it('should throw error when quantity is zero or negative', () => {
      expect(() => {
        OrderItemModel.create({
          orderId: 'order-123',
          productId: 'product-123',
          unitPrice: 10.5,
          quantity: 0,
        });
      }).toThrow('Quantity must be greater than zero');

      expect(() => {
        OrderItemModel.create({
          orderId: 'order-123',
          productId: 'product-123',
          unitPrice: 10.5,
          quantity: -2,
        });
      }).toThrow('Quantity must be greater than zero');
    });
  });

  describe('fromProps', () => {
    it('should create a valid order item model from props', () => {
      const createdAt = new Date();
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
        createdAt,
      };

      const orderItem = OrderItemModel.fromProps(props);

      expect(orderItem).toBeDefined();
      expect(orderItem.id).toBe('item-123');
      expect(orderItem.orderId).toBe('order-123');
      expect(orderItem.productId).toBe('product-123');
      expect(orderItem.unitPrice).toBe(10.5);
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.subtotal).toBe(21);
      expect(orderItem.createdAt).toBe(createdAt);
    });

    it('should throw error when id is not provided', () => {
      const props = {
        id: '',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('ID is required');
    });

    it('should throw error when orderId is not provided', () => {
      const props = {
        id: 'item-123',
        orderId: '',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Order ID is required');
    });

    it('should throw error when productId is not provided', () => {
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: '',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Product ID is required');
    });

    it('should throw error when unitPrice is zero or negative', () => {
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 0,
        quantity: 2,
        subtotal: 21,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Unit price must be greater than zero');
    });

    it('should throw error when quantity is zero or negative', () => {
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 0,
        subtotal: 21,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when subtotal is zero or negative', () => {
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 0,
        createdAt: new Date(),
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Subtotal must be greater than zero');
    });

    it('should throw error when createdAt is not provided', () => {
      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
      } as unknown as any;

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Created at date is required');
    });

    it('should throw error when createdAt is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const props = {
        id: 'item-123',
        orderId: 'order-123',
        productId: 'product-123',
        unitPrice: 10.5,
        quantity: 2,
        subtotal: 21,
        createdAt: futureDate,
      };

      expect(() => {
        OrderItemModel.fromProps(props);
      }).toThrow('Created at date cannot be in the future');
    });
  });
});
