import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTypePricePayment1748146211941 implements MigrationInterface {
  name = 'AlterTypePricePayment1748146211941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "order_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "order_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "store_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "total"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "total" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "total"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "total" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "store_id" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "order_id"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "order_id" character varying NOT NULL`,
    );
  }
}
