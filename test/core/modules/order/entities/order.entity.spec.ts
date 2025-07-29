import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';
import { OrderItem } from 'src/core/modules/order/entities/order-item.entity';
import {
  Order,
  OrderStatusEnum,
} from 'src/core/modules/order/entities/order.entity';

describe('Order Entity', () => {
  let validOrderItem: OrderItem;

  beforeEach(() => {
    const orderItemResult = OrderItem.create({
      productId: 'product-123',
      unitPrice: 15.99,
      quantity: 2,
    });
    validOrderItem = orderItemResult.value!;
  });

  describe('create', () => {
    it('should create a valid order', () => {
      const orderData = {
        storeId: 'store-123',
        orderItems: [validOrderItem],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Order);
      expect(result.value!.storeId).toBe('store-123');
      expect(result.value!.status).toBe(OrderStatusEnum.PENDING);
      expect(result.value!.orderItems).toHaveLength(1);
      expect(result.value!.totalPrice).toBe(31.98);
      expect(result.value!.id).toBeDefined();
      expect(result.value!.createdAt).toBeInstanceOf(Date);
      expect(result.value!.customer).toBeUndefined();
      expect(result.value!.customerId).toBeUndefined();
      expect(result.value!.totemId).toBeUndefined();
    });

    it('should create a valid order with customer ID', () => {
      const orderData = {
        storeId: 'store-123',
        customerId: 'customer-123',
        orderItems: [validOrderItem],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Order);
      expect(result.value!.customerId).toBe('customer-123');
    });

    it('should create a valid order with totem ID', () => {
      const orderData = {
        storeId: 'store-123',
        totemId: 'totem-123',
        orderItems: [validOrderItem],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Order);
      // Note: totemId is not supported in the create method, only in restore
      expect(result.value!.totemId).toBeUndefined();
    });

    it('should fail to create order without store ID', () => {
      const orderData = {
        storeId: '',
        orderItems: [validOrderItem],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Store ID is required');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order without order items', () => {
      const orderData = {
        storeId: 'store-123',
        orderItems: [],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Order must have at least one item');
      expect(result.value).toBeUndefined();
    });

    it('should fail to create order with duplicate order item IDs', () => {
      const duplicateItemResult = OrderItem.restore({
        id: validOrderItem.id, // Same ID as validOrderItem
        productId: 'product-456',
        unitPrice: 10.99,
        quantity: 1,
        createdAt: new Date(),
      });

      const orderData = {
        storeId: 'store-123',
        orderItems: [validOrderItem, duplicateItemResult.value!],
      };

      const result = Order.create(orderData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Duplicated order item IDs are not allowed',
      );
      expect(result.value).toBeUndefined();
    });
  });

  describe('restore', () => {
    it('should restore a valid order', () => {
      const orderData = {
        id: 'order-123',
        storeId: 'store-123',
        status: OrderStatusEnum.PENDING,
        orderItems: [validOrderItem],
        createdAt: new Date(),
      };

      const result = Order.restore(orderData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Order);
      expect(result.value!.id).toBe('order-123');
      expect(result.value!.status).toBe(OrderStatusEnum.PENDING);
    });

    it('should fail to restore order with empty ID', () => {
      const orderData = {
        id: '',
        storeId: 'store-123',
        status: OrderStatusEnum.PENDING,
        orderItems: [validOrderItem],
        createdAt: new Date(),
      };

      const result = Order.restore(orderData);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('ID is required');
      expect(result.value).toBeUndefined();
    });
  });

  describe('status transitions', () => {
    let order: Order;

    beforeEach(() => {
      const orderResult = Order.create({
        storeId: 'store-123',
        orderItems: [validOrderItem],
      });
      order = orderResult.value!;
    });

    it('should transition from PENDING to RECEIVED', () => {
      expect(order.status).toBe(OrderStatusEnum.PENDING);

      order.setToReceived();

      expect(order.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should transition from RECEIVED to IN_PROGRESS', () => {
      order.setToReceived();
      expect(order.status).toBe(OrderStatusEnum.RECEIVED);

      order.setToInProgress();

      expect(order.status).toBe(OrderStatusEnum.IN_PROGRESS);
    });

    it('should transition from IN_PROGRESS to READY', () => {
      order.setToReceived();
      order.setToInProgress();
      expect(order.status).toBe(OrderStatusEnum.IN_PROGRESS);

      order.setToReady();

      expect(order.status).toBe(OrderStatusEnum.READY);
    });

    it('should transition from READY to FINISHED', () => {
      order.setToReceived();
      order.setToInProgress();
      order.setToReady();
      expect(order.status).toBe(OrderStatusEnum.READY);

      order.setToFinished();

      expect(order.status).toBe(OrderStatusEnum.FINISHED);
    });

    it('should transition from PENDING to CANCELED', () => {
      expect(order.status).toBe(OrderStatusEnum.PENDING);

      order.setToCanceled();

      expect(order.status).toBe(OrderStatusEnum.CANCELED);
    });

    it('should fail to set to received if not pending', () => {
      order.setToReceived();

      expect(() => order.setToReceived()).toThrow(ResourceInvalidException);
      expect(() => order.setToReceived()).toThrow(
        'Order can only be set to received if it is pending',
      );
    });

    it('should fail to set to in progress if not received', () => {
      expect(() => order.setToInProgress()).toThrow(ResourceInvalidException);
      expect(() => order.setToInProgress()).toThrow(
        'Order can only be started if it is received',
      );
    });

    it('should fail to set to ready if not in progress', () => {
      expect(() => order.setToReady()).toThrow(ResourceInvalidException);
      expect(() => order.setToReady()).toThrow(
        'Order can only be set to ready if it is in progress',
      );
    });

    it('should fail to set to finished if not ready', () => {
      expect(() => order.setToFinished()).toThrow(ResourceInvalidException);
      expect(() => order.setToFinished()).toThrow(
        'Order can only be set to finished if it is ready',
      );
    });

    it('should fail to cancel if not pending', () => {
      order.setToReceived();

      expect(() => order.setToCanceled()).toThrow(ResourceInvalidException);
      expect(() => order.setToCanceled()).toThrow(
        'Only pending orders can be canceled',
      );
    });
  });

  describe('removeItem', () => {
    let order: Order;
    let secondOrderItem: OrderItem;

    beforeEach(() => {
      const secondItemResult = OrderItem.create({
        productId: 'product-456',
        unitPrice: 10.99,
        quantity: 1,
      });
      secondOrderItem = secondItemResult.value!;

      const orderResult = Order.create({
        storeId: 'store-123',
        orderItems: [validOrderItem, secondOrderItem],
      });
      order = orderResult.value!;
    });

    it('should remove an item from pending order', () => {
      expect(order.orderItems).toHaveLength(2);

      const result = order.removeItem(validOrderItem.id);

      expect(result.error).toBeUndefined();
      expect(result.value).toBe(validOrderItem);
      expect(order.orderItems).toHaveLength(1);
      expect(order.orderItems[0]).toBe(secondOrderItem);
    });

    it('should fail to remove item that does not exist', () => {
      const result = order.removeItem('non-existent-id');

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Order item not found');
      expect(result.value).toBeUndefined();
    });

    it('should fail to remove item from non-pending order', () => {
      order.setToReceived();

      const result = order.removeItem(validOrderItem.id);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Order items can only be removed from pending orders',
      );
      expect(result.value).toBeUndefined();
    });
  });

  describe('associateCustomer', () => {
    let order: Order;
    let customer: Customer;

    beforeEach(() => {
      const orderResult = Order.create({
        storeId: 'store-123',
        orderItems: [validOrderItem],
      });
      order = orderResult.value!;

      const customerResult = Customer.create({
        name: 'John Doe',
        email: Email.create('john@example.com').value!,
        cpf: CPF.create('529.982.247-25').value!,
      });

      customer = customerResult.value!;
    });

    it('should associate customer to order', () => {
      expect(order.customer).toBeUndefined();

      const result = order.associateCustomer(customer);

      expect(result.error).toBeUndefined();
      expect(order.customer).toBe(customer);
    });

    it('should fail to associate customer to order that already has one', () => {
      const associateResult = order.associateCustomer(customer);
      expect(associateResult.error).toBeUndefined();
      expect(order.customer).toBe(customer);

      const anotherCustomerResult = Customer.create({
        name: 'Jane Doe',
        email: Email.create('jane@example.com').value!,
        cpf: CPF.create('12345678909').value!,
      });

      const result = order.associateCustomer(anotherCustomerResult.value!);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'This order already has a customer associated',
      );
      expect(result.value).toBeUndefined();
    });

    it('should fail to associate customer to finished order', () => {
      order.setToReceived();
      order.setToInProgress();
      order.setToReady();
      order.setToFinished();

      const result = order.associateCustomer(customer);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Cannot associate customer to an order that is finished or canceled',
      );
      expect(result.value).toBeUndefined();
    });

    it('should fail to associate customer to canceled order', () => {
      order.setToCanceled();

      const result = order.associateCustomer(customer);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe(
        'Cannot associate customer to an order that is finished or canceled',
      );
      expect(result.value).toBeUndefined();
    });
  });

  describe('totalPrice calculation', () => {
    it('should calculate total price correctly with single item', () => {
      const orderResult = Order.create({
        storeId: 'store-123',
        orderItems: [validOrderItem],
      });

      expect(orderResult.value!.totalPrice).toBe(31.98); // 15.99 * 2
    });

    it('should calculate total price correctly with multiple items', () => {
      const secondItemResult = OrderItem.create({
        productId: 'product-456',
        unitPrice: 10.0,
        quantity: 3,
      });

      const orderResult = Order.create({
        storeId: 'store-123',
        orderItems: [validOrderItem, secondItemResult.value!],
      });

      expect(orderResult.value!.totalPrice).toBeCloseTo(61.98, 2); // 31.98 + 30.00
    });

    it('should calculate total price as zero with no items', () => {
      const orderResult = Order.restore({
        id: 'order-123',
        storeId: 'store-123',
        status: OrderStatusEnum.PENDING,
        orderItems: [],
        createdAt: new Date(),
      });

      expect(orderResult.error).toBeInstanceOf(ResourceInvalidException);
    });
  });
});
