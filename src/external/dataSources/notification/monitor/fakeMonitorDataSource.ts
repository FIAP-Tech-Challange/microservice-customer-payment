import { MonitorDataSource } from './monitor.dataSource';

export class FakeMonitorDataSource implements MonitorDataSource {
  async sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }> {
    // Simulate sending a monitor notification
    console.log(`Monitor notification sent to ${ip}: ${message}`);
    return Promise.resolve({}); // No error
  }
}
