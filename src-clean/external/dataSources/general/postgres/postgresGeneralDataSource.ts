import { DataSource, Repository } from 'typeorm';
import { GeneralDataSource } from '../general.dataSource';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { StoreEntity } from './entities/store.entity';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusEnum } from 'src-clean/core/modules/order/entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderDataSourcePaginationDto } from 'src-clean/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src-clean/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { PaymentEntity } from './entities/payment.entity';

export class PostgresGeneralDataSource implements GeneralDataSource {
  private storeRepository: Repository<StoreEntity>;
  private orderRepository: Repository<OrderEntity>;
  private orderItemRepository: Repository<OrderItemEntity>;
  private paymentRepository: Repository<PaymentEntity>;

  constructor(private dataSource: DataSource) {
    this.storeRepository = this.dataSource.getRepository(StoreEntity);
    this.orderRepository = this.dataSource.getRepository(OrderEntity);
    this.orderItemRepository = this.dataSource.getRepository(OrderItemEntity);
  }
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    throw new Error('Method not implemented.');
  }
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteCustomer(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async saveOrder(order: OrderDataSourceDto): Promise<void> {
    const orderCreate = this.orderRepository.create({
      id: order.id,
      store_id: order.store_id,
      totem_id: order.totem_id,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status as OrderStatusEnum,
      created_at: new Date(order.created_at),
      order_items: order.order_items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: new Date(item.created_at),
      })),
    });

    await this.orderRepository.save(orderCreate);
  }

  async findOrderById(id: string): Promise<OrderDataSourceDto | null> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['order_items', 'customer'],
    });

    if (!order) return null;

    return {
      id: order.id,
      store_id: order.store_id,
      totem_id: order.totem_id,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at.toISOString(),
      order_items: order.order_items.map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at.toISOString(),
      })),
    };
  }

  async findByOrderItemId(id: string): Promise<OrderDataSourceDto | null> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer'],
    });

    if (!orderItem || !orderItem.order) return null;

    const order = orderItem.order;
    const orderItems = order.order_items || [];

    return {
      id: order.id,
      store_id: order.store_id,
      totem_id: order.totem_id,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status,
      created_at:
        order.created_at instanceof Date
          ? order.created_at.toISOString()
          : order.created_at,
      order_items: orderItems.map((item: OrderItemEntity) => ({
        id: item.id,
        order_id: item.order,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at:
          item.created_at instanceof Date
            ? item.created_at.toISOString()
            : item.created_at,
      })),
    };
  }

  async deleteOrder(order: OrderDataSourceDto): Promise<void> {
    const result = await this.orderRepository.delete(order.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order id ${order.id} not found`);
    }
  }

  async deleteOrderItem(orderItem: string): Promise<void> {
    const result = await this.orderItemRepository.delete(orderItem);

    if (result.affected === 0) {
      throw new NotFoundException(`Order id ${orderItem} not found`);
    }
  }

  async getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderDataSourcePaginationDto> {
    const params: {
      skip: number;
      take: number;
      relations?: string[];
      order: { [key: string]: 'ASC' | 'DESC' };
      where?: Record<string, unknown>;
    } = {
      skip: (page - 1) * limit,
      take: limit,
      relations: ['order_items', 'customer'],
      order: { created_at: 'DESC' },
    };

    if (status) {
      params.where = { status: status as OrderStatusEnum };
    }

    if (storeId) {
      params.where = { ...params?.where, store_id: storeId };
    }

    const orders = await this.orderRepository.findAndCount(params);

    if (!orders || orders[0].length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const orderDataSource = orders[0].map((order) => ({
      id: order.id,
      store_id: order.store_id,
      totem_id: order.totem_id,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at.toISOString(),
      order_items: order.order_items.map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at.toISOString(),
      })),
    }));

    return {
      data: orderDataSource,
      total: orders[1],
      page,
      limit,
      totalPages: Math.ceil(orders[1] / limit),
      hasNextPage: page * limit < orders[1],
      hasPreviousPage: page > 1,
    };
  }

  // --------------- STORE --------------- \\
  async findStoreByTotemAccessToken(
    accessToken: string,
  ): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { totems: { token_access: accessToken } },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: totem.created_at.toISOString(),
      })),
    };
  }

  async findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { id: id },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: totem.created_at.toISOString(),
      })),
    };
  }

  async findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { cnpj: cnpj },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: totem.created_at.toISOString(),
      })),
    };
  }

  async findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { name: name },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: totem.created_at.toISOString(),
      })),
    };
  }

  async findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { email: email },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: totem.created_at.toISOString(),
      })),
    };
  }

  async saveStore(store: StoreDataSourceDTO): Promise<void> {
    const storeEntity = this.storeRepository.create({
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: new Date(store.created_at),
      totems: store.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        token_access: totem.token_access,
        created_at: new Date(totem.created_at),
      })),
    });

    await this.storeRepository.save(storeEntity);
  }

  // --------------- PAYMENT --------------- \\
  async savePayment(paymentDTO: PaymentDataSourceDTO): Promise<void> {
    const paymentEntity = this.paymentRepository.create({
      id: paymentDTO.id,
      order_id: paymentDTO.order_id,
      store_id: paymentDTO.store_id,
      external_id: paymentDTO.external_id,
      total: paymentDTO.total,
      status: paymentDTO.status,
      payment_type: paymentDTO.payment_type,
      plataform: paymentDTO.platform,
      qr_code: paymentDTO.qr_code ?? undefined,
      created_at: new Date(paymentDTO.created_at),
    });
    await this.paymentRepository.save(paymentEntity);
  }

  async findPaymentById(
    paymentId: string,
  ): Promise<PaymentDataSourceDTO | null> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) return null;

    return {
      id: payment.id,
      order_id: payment.order_id,
      store_id: payment.store_id,
      external_id: payment.external_id,
      total: payment.total,
      status: payment.status,
      payment_type: payment.payment_type,
      platform: payment.plataform,
      qr_code: payment.qr_code ?? undefined,
      created_at: payment.created_at.toISOString(),
    };
  }
}
