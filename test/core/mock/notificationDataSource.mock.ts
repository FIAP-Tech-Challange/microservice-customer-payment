import { NotificationDataSource } from 'src/external/dataSources/notification/notification.dataSource';

/**
 * Creates a mocked instance of NotificationDataSource for testing purposes.
 * All methods are automatically mocked using jest.fn() and can be configured
 * individually in each test case.
 *
 * @returns A fully mocked NotificationDataSource instance with jest.Mocked type
 */
export function createMockNotificationDataSource(): jest.Mocked<NotificationDataSource> {
  return {
    sendSMSNotification: jest.fn(),
    sendWhatsappNotification: jest.fn(),
    sendEmailNotification: jest.fn(),
    sendMonitorNotification: jest.fn(),
  };
}
