import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';

/**
 * Creates a mocked instance of GeneralDataSource for testing purposes.
 * All methods are automatically mocked using jest.fn() and can be configured
 * individually in each test case.
 *
 * @returns A fully mocked GeneralDataSource instance with jest.Mocked type
 */
export function createMockGeneralDataSource(): jest.Mocked<GeneralDataSource> {
  return {
    // Store/Totem methods
    findStoreByEmail: jest.fn(),
    findStoreByCnpj: jest.fn(),
    findStoreByName: jest.fn(),
    findStoreById: jest.fn(),
    saveStore: jest.fn(),
    findStoreByTotemAccessToken: jest.fn(),

    // Product/Category methods
    findAllCategoriesByStoreId: jest.fn(),
    saveCategory: jest.fn(),
    findCategoryById: jest.fn(),
    findCategoryByNameAndStoreId: jest.fn(),
    findProductsById: jest.fn(),

    // Payment methods
    savePayment: jest.fn(),
    findPaymentById: jest.fn(),
    findPaymentByOrderId: jest.fn(),

    // Customer methods
    findCustomerById: jest.fn(),
    findCustomerByCpf: jest.fn(),
    findCustomerByEmail: jest.fn(),
    findAllCustomers: jest.fn(),
    saveCustomer: jest.fn(),

    // Order methods
    saveOrder: jest.fn(),
    deleteOrder: jest.fn(),
    deleteOrderItem: jest.fn(),
    getAllOrders: jest.fn(),
    findOrderById: jest.fn(),
    findByOrderItemId: jest.fn(),
    getFilteredAndSortedOrders: jest.fn(),

    // Notification methods
    saveNotification: jest.fn(),
  };
}
