/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OrderModel } from '../../../../src/modules/order/models/domain/order.model';
import { OrderItemModel } from '../../../../src/modules/order/models/domain/order-item.model';
import { OrderStatusEnum } from '../../../../src/modules/order/models/enum/order-status.enum';

describe('OrderModel', () => {
  describe('create', () => {
    it('should create a valid order model', () => {
      const order = OrderModel.create({
        storeId: 'store-123',
        totemId: 'totem-123',
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.storeId).toBe('store-123');
      expect(order.totemId).toBe('totem-123');
      expect(order.totalPrice).toBe(0);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should create a valid order model without totemId', () => {
      const order = OrderModel.create({
        storeId: 'store-123',
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.storeId).toBe('store-123');
      expect(order.totemId).toBeUndefined();
      expect(order.totalPrice).toBe(0);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when storeId is not provided', () => {
      expect(() => {
        OrderModel.create({
          storeId: '',
          totemId: 'totem-123',
        });
      }).toThrow('Store ID is required');
    });
  });

  describe('fromProps', () => {
    it('should create a valid order model from props', () => {
      const createdAt = new Date();
      const props = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 100,
        storeId: 'store-123',
        totemId: 'totem-123',
        createdAt,
      };

      const order = OrderModel.fromProps(props);

      expect(order).toBeDefined();
      expect(order.id).toBe('order-123');
      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.storeId).toBe('store-123');
      expect(order.totemId).toBe('totem-123');
      expect(order.totalPrice).toBe(100);
      expect(order.createdAt).toBe(createdAt);
    });

    it('should throw error when id is not provided', () => {
      const props = {
        id: '',
        status: OrderStatusEnum.PENDING,
        totalPrice: 100,
        storeId: 'store-123',
        totemId: 'totem-123',
        createdAt: new Date(),
      };

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('ID is required');
    });

    it('should throw error when status is not provided', () => {
      const props = {
        id: 'order-123',
        status: '' as any,
        totalPrice: 100,
        storeId: 'store-123',
        totemId: 'totem-123',
        createdAt: new Date(),
      };

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('Status is required');
    });

    it('should throw error when totalPrice is negative', () => {
      const props = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: -10,
        storeId: 'store-123',
        totemId: 'totem-123',
        createdAt: new Date(),
        orderItems: [
          OrderItemModel.fromProps({
            id: 'item-1',
            orderId: 'order-123',
            productId: 'product-1',
            unitPrice: 10,
            quantity: 1,
            subtotal: 10,
            createdAt: new Date(),
          }),
        ],
      };

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('Total price must be greater than zero');
    });

    it('should throw error when storeId is not provided', () => {
      const props = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 100,
        storeId: '',
        totemId: 'totem-123',
        createdAt: new Date(),
      };

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('Store ID is required');
    });

    it('should throw error when createdAt is not provided', () => {
      const props = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 100,
        storeId: 'store-123',
        totemId: 'totem-123',
      } as any;

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('Created at date is required');
    });

    it('should throw error when createdAt is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const props = {
        id: 'order-123',
        status: OrderStatusEnum.PENDING,
        totalPrice: 100,
        storeId: 'store-123',
        totemId: 'totem-123',
        createdAt: futureDate,
      };

      expect(() => {
        OrderModel.fromProps(props);
      }).toThrow('Created at date cannot be in the future');
    });
  });

  describe('addOrderItens', () => {
    it('should add items to an order and calculate total price', () => {
      const order = OrderModel.create({
        storeId: 'store-123',
        totemId: 'totem-123',
      });

      const orderItems = [
        OrderItemModel.create({
          orderId: order.id,
          productId: 'product-1',
          unitPrice: 10.5,
          quantity: 2,
        }),
        OrderItemModel.create({
          orderId: order.id,
          productId: 'product-2',
          unitPrice: 15.75,
          quantity: 1,
        }),
      ];

      const orderWithItems = OrderModel.addOrderItens(order, orderItems);

      expect(orderWithItems.orderItems).toEqual(orderItems);
      expect(orderWithItems.totalPrice).toBe(10.5 * 2 + 15.75 * 1);
    });
  });
});
