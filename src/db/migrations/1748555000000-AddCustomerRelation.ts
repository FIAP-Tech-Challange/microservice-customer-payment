import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerRelation1748555000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign key constraint for customer_id in order table
    await queryRunner.query(`
      ALTER TABLE "order"
      ADD CONSTRAINT "FK_order_customer"
      FOREIGN KEY ("customer_id")
      REFERENCES "customers" ("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "order"
      DROP CONSTRAINT "FK_order_customer"
    `);
  }
}
