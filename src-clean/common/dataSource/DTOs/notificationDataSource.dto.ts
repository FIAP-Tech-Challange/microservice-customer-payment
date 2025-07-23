export interface NotificationDataSourceDTO {
  id: string;
  channel: string;
  destination_token: string;
  message: string;
  status: string;
  error_message?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FindNotificationsByStatusParamsDTO {
  status?: string;
  page?: number;
  size?: number;
}
