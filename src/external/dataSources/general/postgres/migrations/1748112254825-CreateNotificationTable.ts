import {
  NotificationChannel,
  NotificationStatus,
} from 'src/core/modules/notification/entities/notification.enums';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationTable1748112254825
  implements MigrationInterface
{
  name = 'CreateNotificationTable1748112254825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "notification_channel_enum" AS ENUM (' +
        Object.values(NotificationChannel)
          .map((value) => `'${value}'`)
          .join(', ') +
        ')',
    );
    await queryRunner.query(
      'CREATE TYPE "notification_status_enum" AS ENUM (' +
        Object.values(NotificationStatus)
          .map((value) => `'${value}'`)
          .join(', ') +
        ')',
    );
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'channel',
            type: 'notification_channel_enum',
            isNullable: false,
          },
          {
            name: 'destination_token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'notification_status_enum',
            isNullable: false,
          },
          {
            name: 'error_message',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
    await queryRunner.query('DROP TYPE "notification_channel_enum"');
    await queryRunner.query('DROP TYPE "notification_status_enum"');
  }
}
