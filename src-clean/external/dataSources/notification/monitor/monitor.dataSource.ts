export interface MonitorDataSource {
  sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }>;
}
