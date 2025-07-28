import { DataSource, In, Repository } from 'typeorm';
import { GeneralDataSource } from '../general.dataSource';
import { StoreDataSourceDTO } from 'src/common/dataSource/DTOs/storeDataSource.dto';
import { StoreEntity } from './entities/store.entity';
import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusEnum } from 'src/core/modules/order/entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderDataSourcePaginationDto } from 'src/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { CategoryDataSourceDTO } from 'src/common/dataSource/DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { PaymentDataSourceDTO } from 'src/common/dataSource/DTOs/paymentDataSource.dto';
import { PaymentEntity } from './entities/payment.entity';
import { CategoryEntity } from './entities/category.entity';
import { OrderFilteredDto } from 'src/core/modules/order/DTOs/order-filtered.dto';
import { ProductDataSourceDTO } from 'src/common/dataSource/DTOs/productDataSource.dto';
import { ProductEntity } from './entities/product.entity';
import { NotificationDataSourceDTO } from 'src/common/dataSource/DTOs/notificationDataSource.dto';
import { NotificationEntity } from './entities/notification.entity';
import { CustomerEntity } from './entities/customer.entity';

export class PostgresGeneralDataSource implements GeneralDataSource {
  private storeRepository: Repository<StoreEntity>;
  private orderRepository: Repository<OrderEntity>;
  private orderItemRepository: Repository<OrderItemEntity>;
  private paymentRepository: Repository<PaymentEntity>;
  private categoryRepository: Repository<CategoryEntity>;
  private productRepository: Repository<ProductEntity>;
  private notificationRepository: Repository<NotificationEntity>;
  private customerRepository: Repository<CustomerEntity>;

  constructor(private dataSource: DataSource) {
    this.storeRepository = this.dataSource.getRepository(StoreEntity);
    this.orderRepository = this.dataSource.getRepository(OrderEntity);
    this.orderItemRepository = this.dataSource.getRepository(OrderItemEntity);
    this.paymentRepository = this.dataSource.getRepository(PaymentEntity);
    this.categoryRepository = this.dataSource.getRepository(CategoryEntity);
    this.productRepository = this.dataSource.getRepository(ProductEntity);
    this.notificationRepository =
      this.dataSource.getRepository(NotificationEntity);
    this.customerRepository = this.dataSource.getRepository(CustomerEntity);
  }
  // --------------- PRODUCT CATEGORY --------------- \\
  async findAllCategoriesByStoreId(
    storeId: string,
  ): Promise<CategoryDataSourceDTO[]> {
    const categories = await this.categoryRepository.find({
      where: { store_id: storeId },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
      store_id: category.store_id,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description ?? '',
        prep_time: Number(product.prep_time),
        image_url: product.image_url,
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
        store_id: product.store_id,
      })),
    }));
  }
  async saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void> {
    await this.categoryRepository.save({
      id: categoryDTO.id,
      name: categoryDTO.name,
      created_at: new Date(categoryDTO.created_at),
      updated_at: new Date(categoryDTO.updated_at),
      store_id: categoryDTO.store_id,
      products: categoryDTO.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        prep_time: product.prep_time,
        image_url: product.image_url,
        created_at: new Date(product.created_at),
        updated_at: new Date(product.updated_at),
        store_id: product.store_id,
      })),
    });
  }
  async findCategoryById(id: string): Promise<CategoryDataSourceDTO | null> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
      store_id: category.store_id,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description ?? '',
        prep_time: Number(product.prep_time),
        image_url: product.image_url,
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
        store_id: product.store_id,
      })),
    };
  }
  async findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null> {
    const category = await this.categoryRepository.findOne({
      where: { name: name, store_id: storeId },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
      store_id: category.store_id,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description ?? '',
        prep_time: Number(product.prep_time),
        image_url: product.image_url,
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
        store_id: product.store_id,
      })),
    };
  }
  async findProductsById(
    productIds: string[],
  ): Promise<ProductDataSourceDTO[]> {
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description ?? '',
      prep_time: Number(product.prep_time),
      image_url: product.image_url,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
      store_id: product.store_id,
    }));
  }

  // --------------- CUSTOMER --------------- \\
  async findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { id: id },
    });
    if (!costumer) return null;

    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toISOString(),
      updatedAt: costumer.updatedAt?.toISOString(),
    };
  }
  async findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { cpf: cpf },
    });
    if (!costumer) return null;
    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toString(),
      updatedAt: costumer.updatedAt?.toString(),
    };
  }
  async findCustomerByEmail(
    email: string,
  ): Promise<CustomerDataSourceDTO | null> {
    const costumer = await this.customerRepository.findOne({
      where: { email: email },
    });
    if (!costumer) return null;
    return {
      id: costumer.id,
      cpf: costumer.cpf,
      name: costumer.name,
      email: costumer.email,
      createdAt: costumer.createdAt?.toString(),
      updatedAt: costumer.updatedAt?.toString(),
    };
  }
  async findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    if (!paginatedParams.page) paginatedParams.page = 1;
    if (!paginatedParams.limit) paginatedParams.limit = 10;

    const params: {
      where: Record<string, unknown>;
    } = {
      where: {},
    };

    if (filters.cpf) {
      params.where = { cpf: filters.cpf };
    }

    if (filters.name) {
      params.where = { ...params.where, name: filters.name };
    }

    if (filters.email) {
      params.where = { ...params.where, email: filters.email };
    }

    const costumers = await this.customerRepository.findAndCount({
      skip: (paginatedParams.page - 1) * paginatedParams.limit,
      take: paginatedParams.limit,
      where: params.where,
      order: { name: 'ASC' },
    });

    if (!costumers || costumers[0].length === 0) {
      return {
        data: [],
        total: 0,
        page: paginatedParams.page,
        limit: paginatedParams.limit,
        totalPages: 0,
      };
    }
    const costumersDTO = costumers[0].map((customer) => ({
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt.toString(),
      updatedAt: customer.updatedAt.toString(),
    }));

    return {
      data: costumersDTO,
      total: costumersDTO.length,
      page: paginatedParams.page,
      limit: paginatedParams.limit,
      totalPages: 0,
    };
  }
  async saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    await this.customerRepository.save({
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    });
  }

  // --------------- ORDER --------------- \\
  async saveOrder(order: OrderDataSourceDto): Promise<OrderDataSourceDto> {
    const orderCreate = this.orderRepository.create({
      id: order.id,
      store_id: order.store_id,
      totem_id: order.totem_id,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status as OrderStatusEnum,
      created_at: order.created_at,
      order_items: order.order_items.map((item) => ({
        id: item.id,
        order_id: order.id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at,
      })),
    });

    await this.orderRepository.save(orderCreate);

    return order;
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
      customer: order.customer
        ? {
            id: order.customer.id,
            cpf: order.customer.cpf,
            name: order.customer.name,
            email: order.customer.email,
            createdAt: order.customer.createdAt.toISOString(),
            updatedAt: order.customer.updatedAt.toISOString(),
          }
        : null,
      customer_id: order.customer_id,
      total_price: order.total_price,
      status: order.status,
      created_at: order.created_at,
      order_items: order.order_items.map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at,
      })),
    };
  }

  async findByOrderItemId(id: string): Promise<OrderDataSourceDto | null> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order'] /*add order.customer relation if needed*/,
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
      created_at: order.created_at,
      order_items: orderItems.map((item: OrderItemEntity) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at,
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
      relations: ['order_items'] /*add customer */,
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
      created_at: order.created_at,
      order_items: order.order_items.map((item) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        quantity: item.quantity,
        created_at: item.created_at,
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

  async getFilteredAndSortedOrders(storeId: string): Promise<OrderFilteredDto> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.order_items', 'order_items')
      .where('store_id = :storeId and order.status not in (:...excluidos)', {
        storeId,
        excluidos: [
          OrderStatusEnum.CANCELED,
          OrderStatusEnum.FINISHED,
          OrderStatusEnum.PENDING,
        ],
      })
      .orderBy(
        `CASE status
            WHEN :ready THEN 1
            WHEN :inProgress THEN 2
            WHEN :received THEN 3
            ELSE 4
          END`,
      )
      .addOrderBy('order.created_at', 'ASC')
      .setParameters({
        ready: OrderStatusEnum.READY,
        inProgress: OrderStatusEnum.IN_PROGRESS,
        received: OrderStatusEnum.RECEIVED,
      })
      .getMany();

    if (!orders || orders?.length === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    return {
      total: orders.length,
      data: orders.map((order) => ({
        id: order.id,
        store_id: order.store_id,
        totem_id: order.totem_id,
        customer_id: order.customer_id,
        total_price: order.total_price,
        status: order.status,
        created_at: order.created_at,
        order_items: order.order_items.map((item) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          quantity: item.quantity,
          created_at: item.created_at,
        })),
      })),
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

  async findPaymentByOrderId(
    orderId: string,
  ): Promise<PaymentDataSourceDTO | null> {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
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

  // --------------- NOTIFICATION --------------- \\
  async saveNotification(
    notification: NotificationDataSourceDTO,
  ): Promise<void> {
    const notificationEntity = this.notificationRepository.create({
      id: notification.id,
      channel: notification.channel,
      destination_token: notification.destination_token,
      message: notification.message,
      status: notification.status,
      error_message: notification.error_message ?? undefined,
      sent_at: notification.sent_at
        ? new Date(notification.sent_at)
        : undefined,
      created_at: new Date(notification.created_at),
      updated_at: new Date(notification.updated_at),
    });

    await this.notificationRepository.save(notificationEntity);
  }
}
